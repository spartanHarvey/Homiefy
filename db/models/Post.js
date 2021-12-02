const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema = new Schema({

    title: { type: String, required:true},
    body: { type: String,required:true},
    comments: [{ type:mongoose.SchemaTypes.ObjectId, ref:'Comment',default:[], required:false}],
    likes: { type: Array,of:mongoose.SchemaTypes.ObjectId,default:[]},
    whoPosted: {type:mongoose.SchemaTypes.ObjectId, required: true},
    date: { type: Date, default: Date.now }
   

},
{timestamps:true},
{ collection : 'posts' }
);

module.exports = mongoose.model("Post", PostSchema);

