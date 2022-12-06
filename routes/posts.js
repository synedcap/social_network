var express = require('express');
var router = express.Router();
const Post = require("../models/Post");

/* create post */  
router.post('/', async (req, res) => {

    try {

        const newpost = await new Post(req.body)
    
        await newpost.save();
        res.status(200).json(newpost);

    } catch (err) {
        res.status(500).json(err);
    }

});


/* update post */  
router.put('/:id', async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if(post.userId === req.body.userId){

            await post.updateOne({$set:req.body});
            res.status(200).json("post has been updated");

        }else{
            res.status(403).json("you can update only your post");
        }

    } catch (err) {
        res.status(500).json(err);
    }

});

/* delete post */  
router.delete('/:id', async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if(post.userId === req.body.userId){

            await post.deleteOne();
            res.status(200).json("post has been deleted");

        }else{
            res.status(403).json("you can delete only your post");
        }

    } catch (err) {
        res.status(500).json(err);
    }

});

module.exports = router;