const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
const User = require('./User')


const PortfolioSchema = new mongoose.Schema({
    owner:{type: Schema.Types.ObjectId , ref: 'User'},
    stocks: {type:Array},
    timestamp: {type:String , default: ()=> moment().format('MMMM Do YYYY, h:mm:ss a')},
})









module.exports = mongoose.model('Portfolio' , PortfolioSchema)
