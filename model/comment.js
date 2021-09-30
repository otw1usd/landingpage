const mongoose = require ('mongoose');

//Membuat schema
const commentschema = new mongoose.Schema({
    usernameid : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user',
    },
    tanggal : 
        {
            type: Date,
            default: Date.now,
            required:true,
        },
    isicomment: {
        //fill in the comments
        type:String,
        required:true,
    },

    projectid :
    {
        type:String,
        required:true,
    },
    role :
    {
        type:String,
        required:true,
    }




})


const Comment = mongoose.model ('comment',commentschema)


module.exports = Comment;
