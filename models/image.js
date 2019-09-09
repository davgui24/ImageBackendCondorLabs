const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

//Variables to create bd schemas
let Schema = mongoose.Schema;

//Para definir los roles
let typeImageValidate = {
    values: ['profile', 'family', 'friends'],
    message: '{VALUE} is not a valid type'
}

const imageSchema = new Schema({
    name: { type: String, unique: true, required: [true, 'You must enter the name of the image'] },
    description: { type: String },
    path: { type: String, required: false },
    date: { type: Date, required: true, default: new Date().getDate()},
    album: { type: Schema.Types.ObjectId, ref: "Album",  required: [true, "The albums a mandatory field"] }
});

imageSchema.plugin(uniqueValidator, { message: '{PATH} The name must be unique' });

module.exports = mongoose.model('Image', imageSchema);