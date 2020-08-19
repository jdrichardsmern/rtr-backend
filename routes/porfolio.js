const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const User = require('../models/User')


router.get('/:email' , async (req,res,next) => {
    try {
        const user = await User.findOne({email : req.params.email})
        const portfolio = await Portfolio.findOne({owner : user._id})
        return res.status(200).json({portfolio}) 
    }
    catch(err){
        return res.status(500).json({errors: err})
    }
})







module.exports = router;
