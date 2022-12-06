var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const User = require("../models/user");

/* Register */
router.post('/register',async (req, res) => {

    
    try {
        const salt = await bcrypt.genSalt(10);
        //save user and send status
        const user = await new User({
            username: req.body.username,
            email:req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })
    
        await user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
   
});

/* Login */
router.post('/login',async (req, res) => {

    
    try {
         //search user
        const user = await User.findOne({email : req.body.email });

        if (!user) {
            res.status(404).json("user not found");
        }
        else{
            //verify that password are the same
            const password_valid = await bcrypt.compare(req.body.password,user.password);
      
            if(password_valid){
                res.status(200).json(user);
            }else{
                res.status(400).json("Wrong password");
            } 
        }

    } catch(err){
        res.status(500).json(err);
    }
   
});
  
  module.exports = router;