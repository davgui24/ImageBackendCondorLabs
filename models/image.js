const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');

//Variables to create bd schemas
let Schema = mongoose.Schema;
let date = { yerar: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}

//Para definir los roles
let typeImageValidate = {
    values: ['profile', 'family', 'friends'],
    message: '{VALUE} is not a valid type'
}

const imageSchema = new Schema({
    name: { type: String, unique: true, required: [true, 'You must enter the name of the image'] },
    description: { type: String },
    path: { type: String, required: false },
    date: { type: Object, required: true, default: date},
    album: { type: Schema.Types.ObjectId, ref: "Album",  required: [true, "The albums a mandatory field"] }
});

imageSchema.plugin(uniqueValidator, { message: '{PATH} The name must be unique' });

module.exports = mongoose.model('Image', imageSchema);