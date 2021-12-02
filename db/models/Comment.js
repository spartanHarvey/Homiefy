
const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const commentSchema = new Schema({

    text: { type: String, required: true},
    whoCommented: {type:mongoose.SchemaTypes.ObjectId, required: true}


},
{timestamps:true},
{ collection : 'comments' }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment, commentSchema}