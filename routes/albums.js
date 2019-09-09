const express = require('express');
const app = express();



const Album = require("../models/album");


// Create Image
app.post('/form-album', (req, res)=>{

    let body = req.body;

    let album = new Album({
        name: body.name,
        description: body.description,
        images: []
    });

    album.save((err, albumSave) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error saving album",
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            album: albumSave,
            message: 'The album was created successfully'
        });
    });
});



// Delete an image by id
// ==============================================
app.delete('/deleteAlbum/:id',  (req, res) => {
    let id = req.params.id;

    Album.findById(id, (err, albumBD) =>{
        if(albumBD){
            if(albumBD.images.length > 0){
              return res.status(400).json({
                    ok: false,
                    error: err,
                    message: 'There are images associated with this album',
                    albumBD: albumBD
                });
            }else{
                Album.findByIdAndDelete(id, (err, albumDelete) => {
                return res.status(200).json({
                        ok: true,
                        message: 'Album deleted successfully',
                        albumDelete
                    });
                });
            }
        }else{
            return res.status(400).json({
                ok: false,
                message: 'There is no album with that id',
                err: { message: 'There is no album with that id' }
            });
        }
    })
});


// ********************************************************

// List Albums
app.get('/listAlbums', (req, res, next) =>{


    let from = req.query.from || 0;
    from = Number(from);
    Album.find({})
    .skip(from)
    // .limit(3)
    .exec((err, albumBD) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error loading album",
                errors: err
            });
        }

        Album.countDocuments({}, (err, count) => {
            return res.status(200).json({
                ok: true,
                albumBD,
                count
            });
        });
    })
})


module.exports = app;