const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

//Variables to create bd schemas
let Schema = mongoose.Schema;


const albumSchema = new Schema({
    name: { type: String, unique: true, required: [true, 'You must enter the name of the album'] },
    description: { type: String, required: [true, 'You must enter the album of the album'] },
    images: { type: [Schema.Types.ObjectId],  default: [] }
});

albumSchema.plugin(uniqueValidator, { message: '{PATH} The album must be unique' });

module.exports = mongoose.model('Album', albumSchema);