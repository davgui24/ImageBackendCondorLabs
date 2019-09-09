const express = require('express');
const app = express();

const path = require('path');
const multer = require('multer');
const fs = require('fs');


const Image = require("../models/image");
const Album = require("../models/album");


// Upload Image
let storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, `./images`)
    },
    filename: (req, file, cb)=>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
})

const upload = multer({storage});

app.use(express.json());
app.use(express.urlencoded({extended: true}))



// ********************************************************************


// Create ImageonInputImagelogoChange
app.post('/upLoadImage', upload.single('file'), (req, res)=>{

    let body = req.body;

    let image = new Image({
        path: req.file.path,
        name: body.name,
        description: body.description,
        album: body.album,
        date: body.date
});



    Album.findById(image.album, (err, albumBD) =>{
        if (!albumBD) {
            return res.status(500).json({
                ok: false,
                message: "Error finding album",
                error: err
            });
        }else{

            image.save((err, imageSave) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: "Error saving image",
                        errors: err
                    });
                }
        
                albumBD.images.push(imageSave.id);
                albumBD.save((err, albumSave) =>{
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: "Error updating Album",
                            err: err
                        });
                    }
                })
        
                return res.status(200).json({
                    ok: true,
                    image: imageSave,
                    mesaje: `Storage location is: ${req.hostname}/${req.file.path}`
                });
            });
            
        }
    })
});



// **************************************************************



// Delete an image by id
// ==============================================
app.delete('/deleteImage/:id',  (req, res) => {
    let id = req.params.id;

    
    Image.findByIdAndDelete(id, (err, imageDelete) => {

        if(!imageDelete){
            return res.status(400).json({
                ok: false,
                message: 'Image id not found'
            })
        }

        fs.unlink(imageDelete.path, (err)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    message: 'No se eliminó la imagen sel server'
                })
            }
        })

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error deleting image',
                err: err
            });
        }

        if (!imageDelete) {
            return res.status(400).json({
                ok: false,
                message: 'There is no image with that id',
                err: { message: 'There is no image with that id' }
            });
        }


    //    Update albun when deleting an image
        Album.findById(imageDelete.album, (err, albumBD) =>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error finding album",
                    error: error
                });
            }else{
                let index = albumBD.images.indexOf(imageDelete.id);

                if (index > -1) {
                    albumBD.images.splice(index, 1);
                    console.log('Este es el index', index);
                 }

                albumBD.save((err, albumSave) =>{
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: "Error updating Album",
                            err: err
                        });
                    }
                })
            }
        })

        res.status(200).json({
            ok: true,
            messaje: 'Image deleted successfully',
            imageDelete
        });

    });
});




// ********************************************************

// List images
app.get('/listImages', (req, res, next) =>{

    let from = req.query.from || 0;
    from = Number(from);

    Image.find({})
    .skip(from)
    // .limit(3)
    .populate('album', ('name description'))
    .exec((err, imageBD) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error loading image",
                errors: err
            });
        }

        Image.countDocuments({}, (err, count) => {
            return res.status(200).json({
                ok: true,
                image: imageBD,
                count
            });
        });
    })
});




// ********************************************************

// Update Albums
app.put('/Updateimage/:id', (req, res) =>{
    
    let id = req.params.id;
    let body = req.body;

    Image.findById(id, (error, imageBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error searching image",
                error: error
            });
        }

        if (!imageBD) {
            return res.status(400).json({
                ok: false,
                mensaje: "There is no image with the id " + id,
                error: { mensaje: 'There is no image with that id' }
            });
        } else {

            imageBD.name = body.name;
            imageBD.description = body.description;
            // imageBD.type = body.type;
            imageBD.album = body.album;

            imageBD.save((err, imageSave) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Error updating image",
                        err: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    image: imageSave,
                });

            });
        }

    });
})



// ********************************************************

// Transfer image
app.put('/transferImage/:id', (req, res) =>{
    
    let id = req.params.id;
    let body = req.body;

    Image.findById(id, (error, imageBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error searching image",
                error: error
            });
        }

        if (!imageBD) {
            return res.status(400).json({
                ok: false,
                mensaje: "There is no image with the id " + id,
                error: { mensaje: 'There is no image with that id' }
            });
        } else {

 
            
            let albumFrom = body.albumFrom;
            imageBD.album = body.albumTo;

            imageBD.save((err, imageSave) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: "Error updating image",
                                err: err
                            });
                        }



                        //    Update the album when transferring an image
                        Album.findById(imageBD.album, (err, albumBD) =>{
                        if (err) {
    
                        }else{
                            
                            albumBD.images.push(imageBD.id);
                            
                            albumBD.save((err, albumSave) =>{
               
                            })
                        }
                    })


                    //   Delete the image from the album when transferring an image
                    Album.findById(albumFrom, (err, albumBD) =>{
                        if (err) {
           
                        }else{
                            
                            let index = albumBD.images.indexOf(id);

                            if (index > -1) {
                                albumBD.images.splice(index, 1);
                                console.log('Este es el index', index);
                             }
                            
                            albumBD.save((err, albumSave) =>{
       
                            })
                        }
                    })
                // });


                return res.status(200).json({
                    ok: true,
                    image: imageSave,
                });

            });
        }

    });
})

module.exports = app;