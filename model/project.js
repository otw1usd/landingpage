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
        type: String
    },
    startDate : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
        //next level pake api pupr
    },

    endDate : {
        type: String
        
    },
    projectUsername : {
        type: String, //artinya harus diisi
        //tambah validasi
    },
    projectPassword : {
        type: String,//artinya harus diisi
        //tambah validasi
    },
    username : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
        //owner username
    },

    progrestotal : {
        type: String, //artinya harus diisi
        //tambah validasi
    },
    
    timestampproject1 : {
        type: String,
    },

    nilaiProyek : {
        type: String,
    },

    consultant :[],

    contractor : [],
    
    droneengineer:[],
    
    member : [],

    storyMax : {},

    storyMin : {}

})


const Project = mongoose.model ('project',projectschema)
console.log('Database project connected');

module.exports = Project;
