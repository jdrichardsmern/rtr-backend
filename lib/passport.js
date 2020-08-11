const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcryptjs')


passport.serializeUser((user, done) => {
    done(null, user.email)
})


passport.deserializeUser(async (email, done) => {
    await User.findOne({email}, (err, user) => {
        done(err, user)
    })
})


const authenticatePassword = async (inputPassword , user , done , req) => {
    const exist = await bcrypt.compare(inputPassword , user.password)

    if(!exist){
        return done({errors : 'Check Email or Password'} , null)
    }
    return done(null,user)
}


const verifyCallback = async (req, email , password , done) => {
    await User.findOne({email} , (err,user) => {
        try {
            if(!user) {
                res.status(401).json({errors:'Check Email or Password' })
                // return done(null ,{errors : 'Check Email or Password'})
            }

            authenticatePassword(password , user , done, req)
        } catch (error) {
            done(error , null)
        }
    })
}


passport.use('local-login' , new localStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
},
verifyCallback
))