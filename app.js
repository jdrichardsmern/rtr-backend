const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const app = express();
const session = require('express-session');
let MongoStore = require('connect-mongo')(session)
const passport = require('passport')
require('dotenv').config()
require('./lib/passport');
const log = console.log
const PORT = process.env.PORT || 8080



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const stockRouter = require('./routes/stocks')
const portfolioRouter = require('./routes/porfolio')



mongoose
.connect(process.env.MONGODB_URI , {
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then(() => {console.log('mongodb connected')})
.catch(()=> {console.log('server err')});

// app.use(session({
//   resave:true,
//   saveUninitialized:true,
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({
//     url:process.env.MONGODB_URI,
//     autoReconnect:true
//   }),
//   cookie: {maxAge: 24 * 60 * 60 *1000}
// }));


// app.use(passport.initialize());
// app.use(passport.session());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stock' , stockRouter)
app.use('/portfolio' , portfolioRouter)
app.listen(PORT , () => {
  log(`listening to ${PORT}`)
})

module.exports = app;
