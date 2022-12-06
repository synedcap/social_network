var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const User = require("../models/user");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* update user */
router.put('/:id',async (req, res) => {

  if (req.body.userId === req.params.id || req.body.isAdmin) {

    if (req.body.password) {
        try{
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);

        }catch(err){
          return res.status(500).json(err);

        }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id,{
        $set: req.body,
      })
      res.status(200).json("Account has been updated");
    } catch (err) {
      res.status(500).json(err);
    }

  }else{
    return res.status(403).json("You can update only account!")
  }
});
/* delete user */
router.delete('/:id',async (req, res) => {

  if (req.body.userId === req.params.id || req.body.isAdmin) {

    try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json("Account has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }

  }else{
    return res.status(403).json("You can delete only account!")
  }
});
/* get a user */
router.get('/:id',async (req, res) => {

    try {
      const user = await User.findById(req.params.id)

      const {password,updatedAt, ...other} = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }

});
/* follow user */
router.put('/:id/follow',async (req, res) => {

  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentuser = await User.findById(req.body.userId);

      if(!user.followers.includes(req.body.userId)){

          await user.updateOne({$push: {followers: req.body.userId}})
          await currentuser.updateOne({$push: {followings: req.params.id}})
          res.status(200).json(" user has been followed")
      }else{
        res.status(403).json("you already follow this user")
      }
      
    } catch (err) {
      
    }
    
  }else{
    res.status(403).json("you cant follow yourself")
  }

});

/* unfollow user */
router.put('/:id/unfollow',async (req, res) => {

  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentuser = await User.findById(req.body.userId);

      if(user.followers.includes(req.body.userId)){

          await user.updateOne({$pull: {followers: req.body.userId}})
          await currentuser.updateOne({$pull: {followings: req.params.id}})
          res.status(200).json(" user has been unfollowed")
      }else{
        res.status(403).json("you dont follow this user")
      }
      
    } catch (err) {
      
    }
    
  }else{
    res.status(403).json("you cant unfollow yourself")
  }

});

module.exports = router;
