const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/play', async function(req, res, next) {
  // TODO: Implement Game
  let questions = await userController.getQuestions();
  //console.log("Questions: ", questions);

  res.render('play', {user: req.session.user , questions: questions });
});

module.exports = router;