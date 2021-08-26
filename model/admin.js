const mongoose = require ('mongoose');

//Membuat schema
const adminschema = new mongoose.Schema({
    username : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    password : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    }

})


const Admin = mongoose.model ('admin',adminschema)
console.log('database admin connected');

module.exports = Admin;
