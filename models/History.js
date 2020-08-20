const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema


const HistorySchema = new Schema({
    message: {type: String},
    timestamp: {type:String , default: ()=> moment().format('L , h:mm:ss a')},
})




module.exports = mongoose.model('History' , HistorySchema)