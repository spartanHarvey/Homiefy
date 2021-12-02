const router = require('express').Router()
const User = require('../db/models/User')
const Review = require('../db/models/Review')


router.post('/review/:id', async(req,res)=> {

     if (!req.session.currentUser){

        if(process.env.NODE_ENV === 'test') return res.status(403).send({"error":"Login first"});
         return res.redirect('/')
        };
    
    
     let newReview =  new Review({
         whoReview: req.session.currentUser._id,
         whoGotReviewed: req.params.id,
         body: req.body.body
 
     })
     
     try{
 
         const user = await User.findById(req.params.id)
         if(!user){ 
            if(process.env.NODE_ENV === 'test') return res.status(404).send({"error":"the user does not exist or account been deleted"})}
         
         await newReview.save()
       
         if(process.env.NODE_ENV === 'test') return res.status(201).send({"msg":"user reviewed successfully"})

         return res.redirect(`/api/users/profile/${req.params.id}`)
     }
     catch(err){
 
         res.status(500).send(err.message)
     }
 



})


module.exports = router;