const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReviewSchema = new Schema({

    whoReview: {type:mongoose.SchemaTypes.ObjectId, required: true, ref: 'User'},
    whoGotReviewed: {type:mongoose.SchemaTypes.ObjectId, required: true, ref: 'User'},
    body: { type: String,required:true}

},
{timestamps:true},
{ collection : 'reviews' }
);

module.exports = mongoose.model("Review", ReviewSchema);

