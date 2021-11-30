const express = require('express');
const app = express();
const mongoose = require('mongoose');;
const config = require('./config')
// const fileUpload = require('express-fileupload');
const cors = require('cors')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const multer = require("multer");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');
const MongoStore = require('connect-mongo')(session);
const User = require('./db/models/User')
const Post = require('./db/models/Post')


app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { 
        secure: false,  
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly:true
     },
    resave: false,
    store: new MongoStore({mongooseConnection:mongoose.connection})
}));



// app.use(multer({dest:'./uploads/'}).single('profilePicture'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(fileUpload());
app.use(express.static(__dirname + '/public'))
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json());

//set views
app.set('views', './views')
app.set('view engine', 'ejs')



//routes
app.get('/', cors(), async (req,res) => {
    if(req.session.hasOwnProperty('currentUser')){  return res.redirect(`/home/${req.session.currentUser._id}`);}
    res.render('index.ejs')
})


app.get('/home/:id', cors(), async (req,res) => {

    if(!req.session.currentUser){return res.redirect('/');}
    const user = await User.findOne({_id:req.params.id});  //for test modo change params to currentuser
    const post = await Post.find(
        {
            whoPosted:{$ne:req.session.currentUser._id}
    
    }).populate("whoPosted")


    

    res.render('home.ejs',{user:user,posts:post,currentuser:req.session.currentUser})
})

app.post('/home/:id/:keyword', cors(), async(req,res) =>{

    if(!req.session.currentUser){return res.redirect('/');}

    const searchedInUser = await User.find(
        {
           $and: [
                    { $or: 
                            [
                                {firstName: {$eq : req.body.keyword}}, 
                                {lastName: {$eq : req.body.keyword}},
                                {'college.name':  { $eq:req.body.keyword }},
                                {'college.major':  { $eq: req.body.keyword }}
                            ] 
                    }
                ]
   }); 
    const searchedInPost = await Post.find(
      {
            $and: [
                        { $or: 
                                [
                                    {title: { '$regex' : `${req.body.keyword}`, $options: '-i' }}, 
                                    {body: { '$regex' : `${req.body.keyword}`, $options: '-i' }}
                                
                                ] 
                        }
                    ]

    }).populate("whoPosted") 

    return res.redirect(200,'/',searched={searchedInPost,searchedInUser})

})


app.get('/about', cors(), async (req,res) => {

    res.render('about.ejs')
})




app.use('/api/auth',cors(),authRoute);
app.use('/api/users',cors(),usersRoute);
app.use('/api/posts',cors(),postsRoute);
app.use('/api/comments',cors(),commentsRoute);

module.exports = app;