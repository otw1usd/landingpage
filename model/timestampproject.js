const mongoose = require ('mongoose');

//Membuat schema
const timestampprojectschema = new mongoose.Schema({
    projectid : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'project',
    },
    timestampproject1 : {
        type: String, //artinya harus diisi
        //tambah validasi
    },
    timestampproject2 : {
        type: String, //artinya harus diisi
        //tambah validasi
    },

})


const TimeStampProject = mongoose.model ('timestampproject',timestampprojectschema)
console.log('Database timestampproject connected');

module.exports = TimeStampProject;
