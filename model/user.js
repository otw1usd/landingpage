const mongoose = require ('mongoose');

//Membuat schema
const userschema = new mongoose.Schema({
    fullname : {
        type: String,
        // required:true, //artinya harus diisi
        //tambah validasi
    },
    name : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    email : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    company : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
        //next level pake api pupr
    },

    jobs : {
        type: String,
        // required:true, //artinya harus diisi
        //tambah validasi
        //next level pake api pupr
    },
    username : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    password : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    nohp : {
        type: String,
        // phone number
    },
    date:{
        type: Date,
        default: Date.now
    },
    
    image: {
        type: String,
    }

})


const User = mongoose.model ('user',userschema)
console.log('Database user is connected');

module.exports = User;
