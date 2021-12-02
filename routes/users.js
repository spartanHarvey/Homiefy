const router = require('express').Router()
const User = require('../db/models/User')
const bcrypt = require('bcryptjs');


router.get('/profile/:id', async(req,res)=>{
    // if (!req.session.currentUser){ return res.send('redirect to log in')};
    
   
    try{
        const user = await User.findOne({_id:req.params.id});
        if(user) {
            
            if(user._id == req.params.id) res.status(200).send(user);
            
        }
        else res.status(404).send('Account no longer exist')
       
    }catch(err){

        res.send(err);
    }
    
  
    
});

//update user

router.put('/profile/:id', async(req,res)=>{
    
    // if(req.params.id != req.session.currentUser){ return res.send("Need to login")};
    // if(newUser.email  == newUser.lastName == newUser.password  == newUser.firstName == "") {res.status(409).send({"error":"no empty fields"}); return;}
    if(!req.body || Object.keys(req.body).length === 0){ res.status(409).send({"error":"no empty fields"}); return;}

    if(req.body.password){
        
        try{
            req.body.password = await bcrypt.hash(req.body.password, 10);  
            
        }
        catch(err){
            console.log(err);
        }
        
    }
    try{

        const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body},{useFindAndModify: false,new: true});
        res.status(200).send(user);

    }catch(err){

        console.log(err);
        res.send(err);
    }


});
//delete user

router.delete('/profile/:id', async(req,res)=>{
    
    // if(req.params.id != req.session.currentUser){ return res.send("Need to login")};
    try{

        const user = await User.deleteOne({_id:req.params.id});
        res.status(200).send({"msg":'user deleted'});
        
    }catch(err){
        
        console.log(err);
        res.send(err);
    }
    

});

module.exports = router;