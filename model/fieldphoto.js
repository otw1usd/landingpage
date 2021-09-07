const mongoose = require ('mongoose');

//Membuat schema
const fieldphotoschema = new mongoose.Schema({
    projectzone : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'projectzone',
    },
    fieldphoto : {
        type:String,
        required:true,
    },
    timestampproject1 : {
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    }
});


const FieldPhoto = mongoose.model ('fieldphoto',fieldphotoschema)
console.log('Database projectzone connected');

module.exports = FieldPhoto;
