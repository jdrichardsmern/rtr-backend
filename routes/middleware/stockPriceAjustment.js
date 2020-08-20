const priceAjust = (price , stockUnit, units) => {
    let ajustedPrice = price
    for (let i = units ; i > 0 ; i--){
      const rng = Math.floor(Math.random() * 5) /// 1 - 5%
      ajustedPrice += (rng/stockUnit)  * price
    }
     return ajustedPrice.toFixed(2)   
    }
    
    const priceAjustsell = (price , stockUnit, units) => {
        let ajustedPrice = price
        for (let i = units ; i > 0 ; i--){
          const rng = Math.floor(Math.random() * 5) /// 1 - 5%
          ajustedPrice -= (rng/stockUnit)  * price
        }
        if (ajustedPrice < 1){
          return 0
        }
         return ajustedPrice.toFixed(2)  
        }
        
    module.exports = {priceAjust,priceAjustsell}