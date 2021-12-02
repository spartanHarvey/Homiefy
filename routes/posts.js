const router = require('express').Router()
const Post = require('../db/models/Post')
const User = require('../db/models/User')
// const Comment = require('../db/models/Post')



router.get('/post/:postid', async(req,res)=> {

    
    try{
        const post = await Post.findById(req.params.postid)
    
        if(!post){res.status(404).send({"error":"no post not found"}); return;}

        res.status(200).send(post);

    }catch(err){

        res.status(500).send(err);
    }

});


router.get('/:id', async(req,res)=> {

    
    try{
        const posts = await Post.find({whoPosted:req.params.id})
    
        if(!posts || posts.length == 0){res.status(404).send({"error":"no post found"}); return;}
            
        res.status(200).send(posts);

    }catch(err){

        res.status(500).send(err);
    }

});

router.post('/post/:id', async(req,res) => {

       
    if(Object.keys(req.body).length === 0){ res.status(409).send({"error":"empty post"}); return;}
    try{
        
        const post =  new Post({
            whoPosted: req.params.id,
            title: req.body.title,
            body: req.body.body
    
        })

        await post.save();
        res.status(201).send(post)
    }
    catch(err){

        res.status(500).send(err.message)
    }

   

});


router.put('/post/:id/:postid', async(req,res) => {

    if(Object.keys(req.body).length === 0){ res.status(409).send({"error":"empty post"}); return;}

    
    
    try{
        const oldPost = await Post.findById(req.params.postid)
        if(!oldPost){ res.status(404).send({"error":"post not found"}); return;}
        if(req.params.id != oldPost['whoPosted'] ) { res.status(403).send({"error":"Dont have permission to edit this post"}); return;}
        
        const updatedPost= await Post.findByIdAndUpdate(req.params.postid,{$set:req.body},{useFindAndModify: false,new: true});
        await updatedPost.save();
        res.status(201).send(updatedPost)
    }
    catch(err){

        res.status(500).send(err.message)
    }

   

});

router.delete('/post/:id/:postid', async (req,res) => {


    const post = await Post.findById(req.params.postid)
    if(!post){ res.status(404).send({"error":"post not found"}); return;}
    if(req.params.id != post['whoPosted'] ) { res.status(403).send({"error":"Dont have permission to delete this post"}); return;}


    try{

        await Post.deleteOne({_id:post._id});
        res.status(200).send({"msg":'post deleted'});

    }catch(err){
        res.status(500).send(err.message);
    }

});

module.exports = router;