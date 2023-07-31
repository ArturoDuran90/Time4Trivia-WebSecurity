const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/score', async function(req, res, next) {
  // TODO: Implement Game
  
  //console.log("Questions: ", questions);

  res.render('score', {user: req.session.user , questions: questions });
});

module.exports = router;