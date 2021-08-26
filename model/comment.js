const mongoose = require ('mongoose');

//Membuat schema
const commentschema = new mongoose.Schema({
    username : {
        type:String,
        required:true,
    },
    tanggal : 
        {
            type: Date,
            default: Date.now,
            required:true,
        },
    isicomment: {
        type:String,
        required:true,
    },

    projectid :
    {
        type:String,
        required:true,
    },

    jobs :
    {
        type:String,
        required:true,
    },


    company :
    {
        type:String,
        required:true,
    },


})


const Comment = mongoose.model ('comment',commentschema)


module.exports = Comment;
