const mongoose = require ('mongoose');

//Membuat schema
const fieldphotoschema = new mongoose.Schema({
    projectzone : {
        type:String,
        required:true,
    },
    fieldphoto : {
        type:String,
        required:true,
    },
    timestamp : {
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
