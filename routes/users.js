const router = require('express').Router()
const User = require('../db/models/User')
const bcrypt = require('bcryptjs');

const Post = require('../db/models/Post')
const Review = require('../db/models/Review')
const fileUpload = require('express-fileupload');

router.get('/profile/:id', async(req,res,next)=>{


    if (!req.session.currentUser){ 
        if(process.env.NODE_ENV === 'test') return res.status(404).send({"error":"login first"});
        return res.redirect('/')};

    if(req.session.currentUser._id == req.params.id){

        try{
            const user = await User.findOne({_id:req.session.currentUser._id});  //for test modo change params to currentuser
            const post = await Post.find({whoPosted:req.session.currentUser._id});  //for test modo change params to currentuser
            const reviews = await Review.find({whoGotReviewed:req.session.currentUser._id});  //for test modo change params to currentuser
    
            if(user) {
                
                if(process.env.NODE_ENV === 'test'){

                    if(user._id == req.params.id) return res.status(200).send(user);
                }
                res.render('profile.ejs', {user:req.session.currentUser,currentuser:req.session.currentUser, posts:post,reviews})
                next()
            }
            else {
                
                if(process.env.NODE_ENV === 'test') return res.status(404).send({"error":'Account no longer exist'})
                res.redirect('/')
            }
           
        }catch(err){
    
            res.status(500).send(err)

        }
        
    }
    else{

        try{
            const user = await User.findOne({_id:req.params.id});  //for test modo change params to currentuser
            const post = await Post.find({whoPosted:req.params.id});  //for test modo change params to currentuser
            const reviews = await Review.find({whoGotReviewed:req.params.id}).populate('whoReview');  //for test modo change params to currentuser

            if(user) {
                
                if(process.env.NODE_ENV === 'test') return res.status(200).send(user);
                res.render('profile.ejs', {user,currentuser:req.session.currentUser, posts:post,reviews})
                
            }
            else{ 

                if(process.env.NODE_ENV === 'test') return res.status(404).send({"error":'Account no longer exist'})
                res.redirect('/')
            }
           
        }catch(err){
    
            res.status(500).send(err);
        }
        
    }
    
   

  
    
});



router.get('/profile-edit/:id', async (req,res) => {

    if(!req.session.currentUser){
        if(process.env.NODE_ENV === 'test') return res.status().send({"error":"login first"})
        res.redirect('/' )
    }

    try{


       
        const user = await User.findOne({_id:req.session.currentUser._id});  //for test modo change params to currentuser
        req.session.currentUser = user;
        if(process.env.NODE_ENV === 'test') return res.status(200).send(user);
        res.render('profile-edit.ejs',{currentuser:req.session.currentUser})

    }catch(err){
        res.status(500).send(err.message);

    }
})


router.post('/profile-edit/:id', async(req,res)=>{
    

    if(!req.session.currentUser){
        
        if(process.env.NODE_ENV === 'test') return res.status(403).send({"error":"Login first"});
        return res.redirect('/');
    
    }
    if(req.params.id != req.session.currentUser._id){ 
        
        if(process.env.NODE_ENV === 'test') return res.status(403).send({"error":"Need to login"})

        res.redirect(`/profile-edit/${req.session.currentUser._id}`)
    
    };
    
    if(Object.keys(req.body).length === 0){ 
        
        if(process.env.NODE_ENV === 'test') return res.status(409).send({"error":"no empty fields"})
        return res.redirect(`/profile-edit/${req.session.currentUser}`)}


    if(req.body.password){
        
        try{
            req.body.password = await bcrypt.hash(req.body.password, 10);  
            
        }
        catch(err){
            console.log(err);
        }
        
    }
    try{

        
        if(!req.body.profilePicture || !req.body.password){ delete req.body.profilePicture;delete req.body.password} 
        
        const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body},{useFindAndModify: false,new: true});
        if(process.env.NODE_ENV === 'test') return res.status(200).send(user);
        
        // return res.redirect(`users/profile/${req.session.currentUser._id}`);
        res.redirect(`../profile-edit/${req.session.currentUser._id}`)


    }catch(err){

        console.log(err);

        res.status(500).send(err);

    }


});
//delete user

router.delete('/profile/:id', async(req,res)=>{
    

    if(!req.session.currentUser){

        if(process.env.NODE_ENV === 'test') return res.status(401).send({"error":"Login first"})
        return res.redirect('/', msg={"error":"Login first"});
    }

    try{

        const user = await User.deleteOne({_id:req.session.currentUser});


        if(process.env.NODE_ENV === 'test') return res.status(200).send({"msg":'user deleted'});

        res.redirect(200,'logout',msg={"sucess":"account deleted"})

          
        
    }catch(err){
        
        console.log(err);

        res.status(500).send(err);

    }
    

});

module.exports = router;