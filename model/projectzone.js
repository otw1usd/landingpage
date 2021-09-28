const mongoose = require ('mongoose');

//Membuat schema
const projectzoneschema = new mongoose.Schema({
    projectid : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'project',
    },
    zonename : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },

    zoneid : {
        type: String,
        required:true, //artinya harus diisi
        //tambah validasi
    },

    projectZoneProgres :{
        type:String,
    },

    storyMax :{
        type:Number,
    },
    storyMin :{
        type:Number,
    },

})


const ProjectZone = mongoose.model ('projectzone',projectzoneschema)
console.log('Database projectzone connected');

module.exports = ProjectZone;
