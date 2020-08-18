const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const verifyToken = require('./middleware/verifyToken');
const Stock = require('../models/Stocks')
const User  = require('../models/User')
const Portfolio = require('../models/Portfolio')
const {priceAjust , priceAjustsell} = require('./middleware/stockPriceAjustment')

router.get('/all' , async (req,res,next) => {


try {
let stocks = await Stock.find()
return res.status(200).json({stocks})
}

catch(err){
    throw(err)
}

})

router.get('/stock/:id' ,  async (req,res,next)=> {
    
    try {
        let stock = await Stock.findById(req.params.id)
        if(stock){
            return res.status(200).json({stock})
        }
        return res.status(404).json({errors : 'Stocks Not Found'})
    }
    catch(err){
        return res.status(404).json({errors : 'Stocks Not Found' , err})
    }
})


router.post('/create' , verifyToken ,async (req,res,next) => {
    const {name, price , units , email} = req.body
    try {
        const exist = await Stock.findOne({name})
        if (exist){
            return res.status(500).json({errors : 'Stock Exist'})
        }
        let user = await User.findOne({email})
        if (user){
            
            if (price * units > user.capital){
                return res.status(200).json({errors : 'Insufficent Funds'})
            }
            let newStock = await new Stock({owner: user._id ,name,price,units , sold:0})
            newStock.history.push({
                time: Date.now(),
                price: price
            })
            newStock.save()
            .then((stock) => {
                Portfolio.findOne({owner:user._id})
                .then((portfolio) => {
                    console.log(portfolio)
                    portfolio.stocks.push({
                        name,
                        units,
                    })
                    user.capital -= price * units
                    user.save()
                    portfolio.save()
                    return res.status(200).json({success: 'Stock Created' , stock})
                })
                .catch((err) => {
                    return res.status(500).json({errors: 'Portfolio Error' ,err})
                })
            })
            .catch((err) => {
                return res.status(500).json({errors : 'Stock Error' , err})
            })
        }else {
            return res.status(500).json({errors : 'Cant Find User'})
        }
        
    }
    catch(err){
        return res.status(500).json({errors: err})
    }
})


router.put('/buy/:id' , async (req,res,next) => {
    const {email , order} = req.body
    const id = req.params.id
    try {
        let user = await User.findOne({email})
        let portfolio = await Portfolio.findOne({owner: user._id})
        if(user){
            let stock = await Stock.findById(id)
            
            if(order > (stock.units - stock.sold)){
                return res.status(500).json({errors: `Your Request for ${order} exeeded the amount ${(stock.units - stock.sold)}`})
            }
            if(user.captial < (order * stock.price)){
                return res.status(500).json({errors: `Insufficent Capital ${(order * stock.price)}`})
            }
            if(stock.owner === user._id){
                return res.status(500).status({errors: 'You Own This Stock'})
            }
            const oldStockPrice = stock.price
            ///////////////////// 
            stock.sold += order
            stock.price = priceAjust(stock.price , stock.units , order)
            stock.history.push({
                time: Date.now(),
                price: stock.price
            })
            
            /////////////////////
            stock.save().then((stock) => {
                user.capital -= (order * oldStockPrice)
                user.save().then(async () => {
                   let exist = await portfolio.stocks.findIndex((searchStock) => {
                       return searchStock.name === stock.name
                   })
                    
                    if (exist){
                
                        let number  = await portfolio.stocks[exist].units + order
                        Portfolio.updateOne({'owner': user._id, 'stocks.name' : stock.name},
                        {'$set': {
                               'stocks.$.units': number,
                         }},
                            function(err,model) {
                             if(err){
                              console.log(err);
                          }
                          return model;
                   })


                    }else {
                        portfolio.stocks.push({name: stock.name , units: order})
                    }
                    portfolio.save()
                    .then(async(portfolio)=> {
                        
                        try{
                            let sellerportfolio = await Portfolio.findOne({owner: stock.owner})
                            let exist = await sellerportfolio.stocks.findIndex((searchStock) => {
                                return searchStock.name === stock.name
                            })
                            let number  = await sellerportfolio.stocks[exist].units - order

                            Portfolio.updateOne({'owner': stock.owner, 'stocks.name' : stock.name},
                            {'$set': {
                                   'stocks.$.units': number,
                             }},
                                function(err,model) {
                                 if(err){
                                  console.log(err);
                              }
                              return model;
                       })


                            // let sellerportfolio = await Portfolio.findOne({owner: stock.owner})
                            // sellerportfolio.stocks.forEach((findingStock) => {
                            //     if(findingStock.name === stock.name){
                            //         findingStock.units -= order
                            //     }
                            // })
                            // sellerportfolio.save()
                            // console.log(sellerportfolio)
                            return res.status(200).json({message : 'Your order has been successful'})
                        }
                        catch(err){
                            return res.status(500).json({errors :"1", err})
                        }
                    })
                    .catch((err) => {
                        return res.status(500).json({errors :"2", err})
                    })
                }).catch((err) => {
                    return res.status(500).json({errors :"3", err})
                })
    
            })
            .catch((err) => {
                return res.status(500).json({errors :"4", err})
            })
        }
    }

    catch(err){

        return res.status(500).json({errors: 'Ops Somthing Went Wrong ...Catch Error ' ,err})
    }
})
 

router.put('/sell/:id' , async(req,res,next) => {
    const {email , sell} = req.body
    const id = req.params.id
    try {
        let user = await User.findOne({email})
        let portfolio = await Portfolio.findOne({owner: user._id})
        let stock = await Stock.findById(id)
        
        // let exist = portfolio.stocks.filter((searchStock) => {
        //     return searchStock.name === stock.name ? 1 : 0
        // })

        let exist = portfolio.stocks.findIndex((searchStock) => {
            return searchStock.name === stock.name
        })

  
     
         if(!exist){
             return res.status(500).json({errors : 'You do not own any of this stock'})
         }
         if(exist){
            
        
        
            if (portfolio.stocks[exist].units < sell){
                return res.status(500).json({errors : 'You are selling more than you have'})
            } 
            let number = await portfolio.stocks[exist].units - sell
            Portfolio.updateOne({'owner': user._id, 'stocks.name' : stock.name},
            {'$set': {
                   'stocks.$.units': number,
             }},
                function(err,model) {
                 if(err){
                  console.log(err);
              }
              return model;
       })

            // portfolio.stocks.forEach((findStock) => {
            //     if(findStock.name === stock.name){
            //         findStock.unit -= sell
            //         if(findStock.units === 0){
            //             // havent found a solution
            //         }
            //     }
            // })
            
            let buyerPortfolio = await Portfolio.findOne({owner : stock.owner})
            let idx = await buyerPortfolio.stocks.findIndex((searchStock) => {
                return searchStock.name === stock.name
            })

            let sellingNum = await buyerPortfolio.stocks[idx].units + sell

            Portfolio.updateOne({'owner': stock.owner, 'stocks.name' : stock.name},
            {'$set': {
                   'stocks.$.units': sellingNum,
             }},
                function(err,model) {
                 if(err){
                  console.log(err);
              }
              return model;
       })
           console.log(1)
            // buyerPortfolio.stocks.forEach((searchStock) => {
            //     if (searchStock.name === stock.name){
            //         searchStock.units += sell
            //     }
            // })
            user.capital += sell * stock.price
            stock.sold -= sell
            let oldPrice = stock.price
            // stock.price = priceAjust(stock.price , stock.units , sell)
            ///////////////////// this is where i set new price
            stock.price = priceAjustsell(stock.price , stock.units,sell)
            //////////////
            stock.history.push({
                time: Date.now(),
                price: stock.price
            })
            console.log(2)
            user.save()
            portfolio.save()
            buyerPortfolio.save()
            stock.save()
            console.log(3)
            return res.status(200).json({message : `You sold ${sell} of ${stock.name} for ${sell*oldPrice}`})
         }
    }
    catch(err){
        return res.status(500).json({errors : err})
    }
})









module.exports = router