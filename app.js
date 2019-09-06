//1. Requieres
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// =========================================================

//6. import routes
const PORT = require('./config')
const imageRoute = require('./routes/images');
const albumRoute = require('./routes/albums');


// =========================================================

//2. Initialize variables
const app = express();



// =========================================================


//8 Boby Parser  take the body parameters and convert them into a Json
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())



//7. Routes
app.use('/', imageRoute);
app.use('/', albumRoute);

// =========================================================


//5. connection DB
mongoose.connect('mongodb://localhost:27017/imagesDB', (err, res) => {

    if (err) throw err;

    console.log('Data Base: \x1b[32m%s\x1b[0m', 'ONLINE');
});


// =========================================================


//3. Listen to requests
// : \x1b[32m % s\x1b[0m  --> so that the word "online" is placed in green
app.listen(3000, () => {
    console.log('Express server, puerto : ' + PORT + '\x1b[32m%s\x1b[0m', ' online'); 
});