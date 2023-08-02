const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

var shuffledQuestions = "";

router.get('/play', async function(req, res, next) {
  // TODO: Implement Game
  let questions = await userController.getQuestions();
  const numQuestionsToShow = 5
  shuffledQuestions = questions.slice().sort(() => 0.5 - Math.random()).slice(0, numQuestionsToShow)
  //console.log("Questions: ", questions);

  res.render('play', {user: req.session.user , shuffledQuestions: shuffledQuestions });
});

router.post('/score', async function(req, res, next) {
  //console.log(req.body);
  //let questions = await userController.getQuestions();
  var userAnswers = []; // Array to store user's answers

  for (const question in req.body) {
    if (question !== 'submit') {
      const selectedAnswer = req.body[question];
      userAnswers.push({ question, answer: selectedAnswer });
    }
  }
  // console.log(userAnswers);
  // console.log(shuffledQuestions[0].correct_answer);
  // console.log(shuffledQuestions[1].correct_answer);
  // console.log(shuffledQuestions[2].correct_answer);
  // console.log(shuffledQuestions[3].correct_answer);
  // console.log(shuffledQuestions[4].correct_answer);


  res.render('score', { user: req.session.user, userAnswers: userAnswers, shuffledQuestions: shuffledQuestions });
});

module.exports = router;