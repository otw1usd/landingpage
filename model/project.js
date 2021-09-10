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

    progrestotal : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
        //owner username
    },
    
    timestampproject1 : {
        type: String,
    },

    nilaiProyek : {
        type: String,
    },

    konsultan : {
        //consultant
        type: String,
    },

    kontraktor : {
        //contractor
        type: String,
    }    

})


const Project = mongoose.model ('project',projectschema)
console.log('Database project connected');

module.exports = Project;
