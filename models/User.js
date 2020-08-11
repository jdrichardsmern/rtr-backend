const mongoose = require('mongoose')
const moment = require('moment')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{type:String, default:""},
    email: {type:String , unique:  true , lowercase:true , required: true},
    password: {type:String , min: 6 , required:true},
    capital: {type: Number , default: 500000},
    timestamp: {type:String , default: ()=> moment().format('MMMM Do YYYY, h:mm:ss a')}
})

UserSchema.pre('save' , function(next){
    const user = this
    if(!user.isModified('password')) return next()
    bcrypt.genSalt(10 , (err , salt) => {
        if (err) return next(err)
        bcrypt.hash(user.password , salt , (err , hash) => {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})


module.exports = mongoose.model('User' , UserSchema)