const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

var shuffledQuestions = "";
var userScore = 0;

router.get('/play', async function(req, res, next) {
  //let role = req.params.role;
  if (!req.session.user || !req.cookies.isAdmin) {
    res.redirect('/');
  } else {
    let questions = await userController.getQuestions();
    const numQuestionsToShow = 5
    shuffledQuestions = questions.slice().sort(() => 0.5 - Math.random()).slice(0, numQuestionsToShow)
    //console.log("Questions: ", questions);

    res.render('play', {user: req.session.user , shuffledQuestions: shuffledQuestions});
  }
  
});

// router.post('/score', async function(req, res, next) {
//   if (!req.session.user || !req.cookies.isAdmin) {
//     res.redirect('/');
//   } else {
//     let userId = req.session.user.id;
//     let score = parseInt(req.body.score);

//     var userAnswers = []; // Array to store user's answers

//     if (isNaN(score)) {
//       res.render('score', { title: 'Scores', error: 'Invalid Score' });
//       return;
//     }

//     if (leaderboardScores?.status == STATUS_CODES.success) {
//       // Call the createScore function to save the score to the database
//       await userController.createScore(userId, score);

//       for (const question in req.body) {
//         if (question !== 'submit') {
//           const selectedAnswer = req.body[question];
//           userAnswers.push({ question, answer: selectedAnswer });
//         }
//       }

//       res.render('score', { title: "Scores", user: req.session.user, userAnswers: userAnswers, shuffledQuestions: shuffledQuestions });
//     } else {
//       console.error(error);
//       //res.render('score', { title: 'Scores', error: 'Score Submission Failed' });
//       console.log("-------------------There was an Error");
//     }
//   }
// });

router.post('/score', async function(req, res, next) {
  // if (!req.session.user || !req.cookies.isAdmin) {
  //   res.redirect('/');
  // } else {
    //console.log(req.body);
    //let questions = await userController.getQuestions();
    
  //let leaderboardScores = await userController.getScores(); // Ask the DB for all the scores
  var userAnswers = []; // Array to store user's answers
    
    // console.log(shuffledQuestions[0].correct_answer);
    // console.log(shuffledQuestions[1].correct_answer);
    // console.log(shuffledQuestions[2].correct_answer);
    // console.log(shuffledQuestions[3].correct_answer);
    // console.log(shuffledQuestions[4].correct_answer);

  //console.log("Leaderboard Scores: ", leaderboardScores);

    // if (leaderboardUpdated?.status == STATUS_CODES.success) {
  for (const question in req.body) {
    if (question !== 'submit') {
      const selectedAnswer = req.body[question];
      userAnswers.push({ question, answer: selectedAnswer });
    }
  }
      //console.log("1.-UserAnswers: ", userAnswers);
      //res.render('score', { title: "Scores", user: req.session.user, userAnswers: userAnswers, shuffledQuestions: shuffledQuestions });
    // } else {
    //   console.log("2.-UserAnswers: ", userAnswers);
    //   res.render('score', { title: 'Scores', });
    // }
  //}

  // for (const question in req.body) {
  //   if (question !== 'submit') {
  //     const selectedAnswer = req.body[question];
  //     userAnswers.push({ question, answer: selectedAnswer });
  //   }
  // }


  for (let i = 0; i < Math.min(5, shuffledQuestions.length); i++){
    //const question = shuffledQuestions[i]
    console.log("ShuffledQuestions Correct Answers: ", shuffledQuestions[i].correct_answer);
    //const selectedAnswer = req.body[question];
    if (userAnswers[i] && userAnswers[i].answer === shuffledQuestions[i].correct_answer){
      userScore++
    }else{
      console.log("Score not updated");
    }
    console.log(userScore);
  }

  let userId = req.session.user.userId.toString();// Insert Current User.id
  let score = userScore.toString();// Insert Current Score from ";"

  console.log("UserID: ", userId);
  console.log("User Score: ", score);
  let leaderboardUpdated = await userController.createScore(userId, score);

  if (leaderboardUpdated?.status == STATUS_CODES.success) {
    res.render('score', { title: "Scores", user: req.session.user, userAnswers: userAnswers, shuffledQuestions: shuffledQuestions, userScore: userScore });
  } else {
    //console.log("UserAnswers: ", userAnswers)
    console.log("There was an error creating the creating score in db.");
  }
  
});

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

router.get('/leaderboard', async function(req, res, next) {
//   if (!req.session.user || !req.cookies.isAdmin) {
//     res.redirect('/');
//   } else {
//   // TODO: Get actual leader data from the MONGO database!
//   var leaders = [];

//   leaders = await userController.getScores(); // Ask the DB for all the scores
//   if (leaders?.status == STATUS_CODES.success) {
//     res.render('leaderboard', {user: req.session.user, isAdmin: req.cookies.isAdmin, leaders: leaders });
//     console.log("Leaders: ", leaders);
//   } else {
//     //console.log("UserAnswers: ", userAnswers)
//     console.log("There was an error creating the creating score in db.");
//   }
// }
  if (!req.session.user || !req.cookies.isAdmin) {
    res.redirect('/');
  } else {
    let leaders = await userController.getScores();
    //const numQuestionsToShow = 5
    //leaders = questions.slice().sort(() => 0.5 - Math.random()).slice(0, numQuestionsToShow)
    //console.log("Questions: ", questions);

    res.render('leaderboard', {title: "Leaderboard", user: req.session.user , leaders: leaders});
    console.log("Leaders: ", leaders);
  }
  
});

module.exports = router;