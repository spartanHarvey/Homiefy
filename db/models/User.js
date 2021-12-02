const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({

    firstName: { type: String, required:true},
    lastName: { type: String,required:true},
    password: { type: String,required:true},
    email: { type: String,required:true,unique:true},
    profilePicture: { type: String},
    college: {
        type:Object,
        name: {
            type:String
        },
        year:{
            type:String
        },
        major:{
            type:String
        },
        url:{
            type:String
        }
    },
    socialMediaLinks:{
        type:Map,
        of:String,
        name: {
            type:String
        },
        year:{
            type:String
        }
    },
    following:{type: Array, default:[]},
    followers:{type: Array, default:[]},
    // posts: {}
    // bio: { type: String, match: /[a-z]/ },
    date: { type: Date, default: Date.now },
   

},
{timestamps:true},
{ collection : 'users' }
);


module.exports = mongoose.model("User", UserSchema)