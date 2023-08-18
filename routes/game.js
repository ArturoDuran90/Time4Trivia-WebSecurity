const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

var shuffledQuestions = "";

router.get('/play', async function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let questions = await userController.getQuestions();
    const numQuestionsToShow = 5
    shuffledQuestions = questions.slice().sort(() => 0.5 - Math.random()).slice(0, numQuestionsToShow)

    res.render('play', {user: req.session.user , shuffledQuestions: shuffledQuestions});
  }
});

router.post('/score', async function(req, res, next) {
  var userScore = 0;
  if (!req.session.user) {
    res.redirect('/');
  } else {
    var userAnswers = []; // Array to store user's answers

    for (const question in req.body) {
      if (question !== 'submit') {
        const selectedAnswer = req.body[question];
        userAnswers.push({ question, answer: selectedAnswer });
      }
    }

    for (let i = 0; i < Math.min(5, shuffledQuestions.length); i++) {
      try {
        if (userAnswers[i] && userAnswers[i].answer === shuffledQuestions[i].correct_answer) {
          userScore++;
        } else {
          throw new Error("Score not updated");
        }
      } catch (error) {
        console.error(error.message);
      }
    }

    let userId = req.session.user.userId.toString();
    let score = userScore.toString();
    let leaderboardUpdated = await userController.createScore(userId, score);

    try{
      if (leaderboardUpdated?.status == STATUS_CODES.success) {
        res.render('score', { title: "Scores", user: req.session.user, userAnswers: userAnswers, shuffledQuestions: shuffledQuestions, userScore: userScore });
      } else {
        throw new Error("There was an error creating the creating score in db.");
      }
    } catch(error){
      console.error(error.Message);
    }
  }
});

router.get('/leaderboard', async function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let leaders = await userController.getScores();
    res.render('leaderboard', {title: "Leaderboard", user: req.session.user , leaders: leaders});
  }
});

router.get('/create', function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    res.render('create', { title: 'Create a Trivia Question', error: '' });
  }
});

router.post('/create', async function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let question = req.body.question;
    let correctAnswer = req.body.correctAnswer;
    let incorrectAnswer1 = req.body.incorrectAnswer1;
    let incorrectAnswer2 = req.body.incorrectAnswer2;
    let incorrectAnswer3 = req.body.incorrectAnswer3;

    let result = await userController.createQuestion(question, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3);

    if (result?.status == STATUS_CODES.success) {
      res.redirect('/');
    } else {
      res.render('create', { title: 'Create a Trivia Question' });
    }
  }
});

module.exports = router;