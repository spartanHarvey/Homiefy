const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const commentSchema = new Schema({

    text: { type: String, required: true},

    whoCommented: {type:mongoose.SchemaTypes.ObjectId, required: true, ref:'User'},
    post: {type:mongoose.SchemaTypes.ObjectId, required: true, ref:'Post'}



},
{timestamps:true},
{ collection : 'comments' }
);
module.exports = mongoose.model("Comment", commentSchema)

