const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const verifyToken = require('./middleware/verifyToken');
const Stock = require('../models/Stocks')



router.get('/all' , async (req,res,next) => {


try {
let stocks = await Stock.find()
return res.status(200).json({stocks})

}

catch(err){
    throw(err)
}

})




module.exports = router