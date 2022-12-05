var express = require('express');
var router = express.Router();
const User = require("../models/user");

/* REGISTER */
router.post('/register',async (req, res) => {


    try {
        
        const user = await new User({
            username: req.body.username,
            email:req.body.email,
            password: req.body.password
        })
    
        await user.save();

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
   
  });
  
  module.exports = router;