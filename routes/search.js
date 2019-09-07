const express = require("express");
const app = express();
let Album = require("../models/album");
let Image = require("../models/image");


// ============================================
// Search by collection
// ============================================

app.get("/coleccion/:tabla/:busqueda", (req, res) => {
    let search = req.params.search;
    let table = req.params.table;
    let regex = new RegExp(busqueda, "i");
    let promise;

    switch (table) {
        case "images":
            promise = searchImages(search, regex);
            break;

        case "albums":
            promise = searchAlbums(search, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: "The types of searches are only images and albums",
                error: { mensaje: "Invalid table / collection types" }
            });
    }

    promise.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// ============================================
// General search
// ============================================

app.get("/all/:search", (req, res, next) => {
    let search = req.params.search;

    // creando una expreción regular insensible a mayúsculas y minusculas
    let regex = new RegExp(busqueda, "i");

    Promise.all([
        searchImages(search, regex),
        searchAlbums(search, regex)
    ]).then(request => {
        res.status(200).json({
            ok: true,
            images: request[0],
            albums: request[1]
        });
    });
});

// -----------------

function searchImages(search, regex) {
    return new Promise((res, rej) => {
        Image.find({ name: regex })
             .populate('album', ('name description'))
             .exec((err, imageBD) => {
                if (err) {
                    rej("Error loading images", err);
                } else {
                    res(imageBD);
                }
            });
    });
}

// --------------------

function searchAlbums(search, regex) {
    return new Promise((res, rej) => {
        Medico.find({ nombre: regex })
            .exec((err, albumBD) => {
                if (err) {
                    rej("Error loading albums", err);
                } else {
                    res(albumBD);
                }
            });
    });
}


module.exports = app;