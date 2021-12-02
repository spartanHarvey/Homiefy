const router = require('express').Router()
const Comment = require('../db/models/Comment')
const Post = require('../db/models/Post')
const User = require('../db/models/User')




router.post('/comment/:id/:postid', async(req,res) => {


    if (!req.session.currentUser){ return res.redirect('/')};
    if(!req.body) {res.status().send({"error":"empty comment"}); return;}
    
    let newComment =  new Comment({
        text: req.body.text,
        whoCommented: req.params.id,
        post: req.params.postid


    })
    
    try{



        const post = await Post.findById(req.params.postid)
        if(!post){ res.status(404).send({"error":"the post does not exist or has as been deleted"}); return;}
        
        newComment.save()
        post.save();
        res.status(201).redirect(`/api/posts/post/${req.params.postid}`)

    }
    catch(err){

        res.status(500).send(err.message)
    }

   

});


router.delete('/comment/:id/:postid/:commentid', async(req,res) => {

    
    // if(req.params.id != oldPost['whoPosted'] ) { res.status(403).send({"error":"Dont have permission to edit this post"}); return;}
    
    
    try{
        const user = await User.findById(req.params.id)
        let comment = await Comment.findById(req.params.commentid)
        
        if(!comment){ res.status(404).send({"error":"comment not found"}); return;}
        if((!user._id == comment.whoCommented)){ res.status(403).send({"error":"cannot delete this comment"}); return;}
        
        let post = await Post.findOneAndUpdate({_id:req.params.postid}, { $pull: { comments:  req.params.commentid } },{useFindAndModify: false,new: true})
        if(!post){ res.status(404).send({"error":"post not found"}); return;}

        await comment.deleteOne({whoCommented:user._id})
        
        
        


       
        res.status(201).send({"msg":"comment deleted"})
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