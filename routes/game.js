const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

var shuffledQuestions = "";

router.get('/play', async function(req, res, next) {
  //let role = req.params.role;
  if (!req.session.user || !req.cookies.isAdmin) {
    res.redirect('/');
  } else {
    let questions = await userController.getQuestions();
    const numQuestionsToShow = 5
    shuffledQuestions = questions.slice().sort(() => 0.5 - Math.random()).slice(0, numQuestionsToShow)
    //console.log("Questions: ", questions);

    res.render('play', {user: req.session.user , shuffledQuestions: shuffledQuestions });
  }
  
});

router.post('/score', async function(req, res, next) {
  // if (!req.session.user || !req.cookies.isAdmin) {
  //   res.redirect('/');
  // } else {
  //   let userId = req.session.user.id;
  //   let score = parseInt(req.body.score);

  //   var userAnswers = []; // Array to store user's answers

  //   if (isNaN(score)) {
  //     res.render('score', { title: 'Scores', error: 'Invalid Score' });
  //     return;
  //   }

  //   if (leaderboardScores?.status == STATUS_CODES.success) {
  //     // Call the createScore function to save the score to the database
  //     await userController.createScore(1, 4);

  //     for (const question in req.body) {
  //       if (question !== 'submit') {
  //         const selectedAnswer = req.body[question];
  //         userAnswers.push({ question, answer: selectedAnswer });
  //       }
  //     }

      res.render('score', { title: "Scores", user: req.session.user, userAnswers: userAnswers, shuffledQuestions: shuffledQuestions });
  //   } else {
  //     console.error(error);
  //     //res.render('score', { title: 'Scores', error: 'Score Submission Failed' });
  //     console.log("-------------------There was an Error");
  //   }
  // }
});

// router.post('/score', async function(req, res, next) {
//   if (!req.session.user || !req.cookies.isAdmin) {
//     res.redirect('/');
//   } else {
//     //console.log(req.body);
//     //let questions = await userController.getQuestions();
//     let userId = "";// Insert Current User.id
//     let score = "";// Insert Current Score from ";"
//     let leaderboardScores = await userController.createScore(userId, score);
//     var userAnswers = []; // Array to store user's answers

    
//     // console.log(userAnswers);
//     // console.log(shuffledQuestions[0].correct_answer);
//     // console.log(shuffledQuestions[1].correct_answer);
//     // console.log(shuffledQuestions[2].correct_answer);
//     // console.log(shuffledQuestions[3].correct_answer);
//     // console.log(shuffledQuestions[4].correct_answer);

//     if (leaderboardScores?.status == STATUS_CODES.success) {
//       for (const question in req.body) {
//         if (question !== 'submit') {
//           const selectedAnswer = req.body[question];
//           userAnswers.push({ question, answer: selectedAnswer });
//         }
//       }
//       res.render('score', { title: "Scores", user: req.session.user, userAnswers: userAnswers, shuffledQuestions: shuffledQuestions });
//     } else {
//       res.render('score', { title: 'Scores', error: 'Scores Failed' });
//     }
//   }
  

//   // res.render('score', { title: "Scores", user: req.session.user, userAnswers: userAnswers, shuffledQuestions: shuffledQuestions });
// });

// router.post('/register', async function (req, res, next) {
//   let username = req.body.username;
//   let email = req.body.email;
//   let firstName = req.body.firstName;
//   let lastName = req.body.lastName;
//   let password = req.body.password;

//   let result = await userController.createUser(username, email, firstName, lastName, password);

//   if (result?.status == STATUS_CODES.success) {
//     res.redirect('/u/login');
//   } else {
//     res.render('register', { title: 'Time 4 Trivia', error: 'Register Failed' });
//   }
// });

// module.exports = router;