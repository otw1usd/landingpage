const mongoose = require ('mongoose');

//Membuat schema
const timestampprojectschema = new mongoose.Schema({
    projectid : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'project',
    },
    timestampproject : {
        type: Date, 
    },
});


const TimeStampProject = mongoose.model ('timestampproject',timestampprojectschema)
console.log('Database timestampproject connected');

module.exports = TimeStampProject;
