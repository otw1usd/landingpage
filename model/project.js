const mongoose = require ('mongoose');

//Membuat schema
const projectschema = new mongoose.Schema({
    projectName : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    location : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    projectDescription : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    startDate : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
        //next level pake api pupr
    },

    endDate : {
        type: String,
        // required:true, //artinya harus diisi
        //tambah validasi
        //next level pake api pupr
    },
    projectUsername : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    projectPassword : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },
    username : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
        //owner username
    },

    comment:{
        username : {},
        tanggal : {},
        isicomment: {},
    }
    

})


const Project = mongoose.model ('project',projectschema)
console.log('mantap');

module.exports = Project;
