var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', (req, res) => {
  res.redirect('/stock/all');
  // res.send({ response: "I am alive" }).status(200);
});

module.exports = router;
