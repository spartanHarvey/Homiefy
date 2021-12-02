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
        default:{name:'',major:'',year:'',url:''},
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
        type:Object,
        default:{facebook:'',twitter:'',linkedin:'',instagram:''},
        facebook: {
            type:String
        },
        twitter:{
            type:String
        },
        linkedin:{
            type:String
        },
        instagram:{
            type:String
        }
    },
    accountConfig:{
        type:Object,
        isActive: {
            type:String
        },
        isVisiable:{
            type:String
        }
    }

},
{timestamps:true, minimize:false},
{ collection : 'users' }
);


module.exports = mongoose.model("User", UserSchema)