const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  //console.log(req.session.user);
  //console.log("/ cookies", req.cookies);
  res.render('index', { title: 'Time 4 Trivia', user: req.session.user });
});

module.exports = router;