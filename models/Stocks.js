const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
const User = require('./User')

const StockSchema = new mongoose.Schema({
    owner:{type: Schema.Types.ObjectId , ref: 'User'},
    name: {type:String , lowercase: true},
    price: {type:Number},
    units: {type:Number},
    sold: {type:Number , default: 0},
    history: {type: Array},
    timestamp: {type:String , default: ()=> moment().format('MMMM Do YYYY, h:mm:ss a')},
})




module.exports = mongoose.model('Stock' , StockSchema)
