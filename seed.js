
const mongoose = require('mongoose');
const Stock = require('./models/Stocks')
require('dotenv').config()
mongoose
.connect(process.env.MONGODB_URI , {
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then(() => {console.log('mongodb connected')})
.catch(()=> {console.log('server err')});

const stocks = [
    { 
        name: 'Coca',
        price: 10,
        units: 100,
        sold: 0,
    },
    { 
        name: 'Coca2',
        price: 10,
        units: 100,
        sold: 0,
    },
    { 
        name: 'Coca3',
        price: 10,
        units: 100,
        sold: 0,
    },
    { 
        name: 'Coca4',
        price: 10,
        units: 100,
        sold: 0,
    },
    { 
        name: 'Coca5',
        price: 10,
        units: 100,
        sold: 0,
    },
    { 
        name: 'Coca6',
        price: 10,
        units: 100,
        sold: 0,
    },
    { 
        name: 'Coca7',
        price: 10,
        units: 100,
        sold: 0,
    },
    { 
        name: 'Coca8',
        price: 10,
        units: 100,
        sold: 0,
    }
]



const seed = (data) => {
    data.map((data) => {
        const {name, price , units, sold} = data
    const stock = new Stock({owner:'5f32be18ac71851554c85e5d' , name,price,units,sold })
    stock.history.push({
        time: Date.now(),
        price: price
    })
    console.log(stock)
    stock.save()
    .then((data) => console.log(data))
    })
}
seed(stocks)