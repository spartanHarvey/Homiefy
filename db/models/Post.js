const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema = new Schema({

    title: { type: String, required:true},
    body: { type: String,required:true},
    comments: { type:mongoose.SchemaTypes.ObjectId, required:false,ref:'Comment'},
    likes: { type: Array,of:mongoose.SchemaTypes.ObjectId,default:[]},
    whoPosted: {type:mongoose.SchemaTypes.ObjectId, required: true, ref: 'User'}
  

},
{timestamps:true},
{ collection : 'posts' }
);

module.exports = mongoose.model("Post", PostSchema);

