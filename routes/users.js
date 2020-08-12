const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verifyToken = require('./middleware/verifyToken');
const Portfolio = require('../models/Portfolio');
/* GET users listing. */





router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});





router.post('/signup', async (req,res,next) => {
  try {
    const {name,email ,password} = req.body
    let user = await User.findOne({email})

    if(user){
       return res.status(400).json({errors: 'User Exist'})
    }
    user = await new User({name ,email , password })
    
    await user.save().then((user)=> {
      let portfolio = new Portfolio({owner: user._id}).save()
     return res.status(200).json({message: 'User created' , user})
    })
  }
  catch(err){
    throw(err)
  }

})


router.post('/login',  async (req,res,next) => {

try {
  const {email,password} = await req.body
  let user = await User.findOne({email})
   if(!user) {
     return res.status(400).json({errors: 'User Doesnt Exist'})
   }
   const exist = await bcrypt.compare(password, user.password)
   if(!exist){
    return res.status(400).json({errors: 'Incorrect password'})
   }
   const token = jwt.sign({_id:user._id} , process.env.TOKEN_SECRET)

   return res.status(200).header('auth-token', token).json({message: 'you are logged in' , token , user})
}

catch(error){
  console.log(error)
}

})


router.get('/test', verifyToken , (req,res,next) => {
  return res.status(200).json({message: 'u are verified'})
})



// router.post('/login', (req,res,next) => {
//   if (req.body.email === '' || req.body.password ==="") {
//     return res.status(500).json({errors: 'fill out field'})
//   }
//   passport.authenticate('local-login', function (error , user , info) {
//     if (error){
//       console.log(error)
//       return res.status(401).json(error)
//     }
//     // req.login(user , function (error){
//     //   if(error){
//     //     return res.status(500).json({message: error || 'Oops something went wrong'})
//     //   }
//     // })
//     user.isAuthenticated = true
//     return res.json( user)
//   })(req,res,next)

// })


module.exports = router;
