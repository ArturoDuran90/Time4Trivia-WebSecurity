const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  console.log(req.session.user);
  console.log("/ cookies", req.cookies);
  res.render('index', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin });
});

router.get('/leaderboard', function(req, res, next) {
  // TODO: Get actual leader data from the MONGO database!
  var leaders = [];

  res.render('leaderboard', {user: req.session.user, isAdmin: req.cookies.isAdmin, leaders: leaders });
});

module.exports = router;