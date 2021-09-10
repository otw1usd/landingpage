const mongoose = require ('mongoose');

//Membuat schema
const adminschema = new mongoose.Schema({
    username : {
        type: String,
        required:true, 
    },
    password : {
        type: String,
        required:true, 
    }

})


const Admin = mongoose.model ('admin',adminschema)
console.log('database admin connected');

module.exports = Admin;
