const mongoose = require('mongoose');

//Membuat schema
const commentreplyschema = new mongoose.Schema({
  usernameid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  tanggal: {
    type: Date,
    default: Date.now,
    required: true,
  },
  komentarbalasan: {
    //reply of the comment
    type: String,
    required: true,
  },

  projectid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'project',
  },
  commentprojectid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'comment',
  },
  role: {
    type: String,
    required: true,
  }

});


const CommentReply = mongoose.model('commentreply', commentreplyschema)

module.exports = CommentReply;
