const mongoose = require ('mongoose');

//Membuat schema
const tractionschema = new mongoose.Schema({
    traction : {
        type:String,
        required:true,
    },
    date:{
        type: Date,
        default: Date.now
    }
});


const Traction = mongoose.model ('traction',tractionschema);

module.exports = Traction;
