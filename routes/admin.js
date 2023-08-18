const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// All Admin Routes should only be accessble to logged in Admins!

router.get('/users/:role', async function (req, res, next) {
  let role = req.params.role;
  if (!req.session.user || req.session.user.admin == 'no') {
    res.redirect('/');
  } else {
    let users = await userController.getUsers(role);

    res.render('users', { title: 'Time 4 Trivia', user: req.session.user, users: users });
  }
});

router.get('/delete/:userId', async function (req, res, next) {
  let userId = req.params.userId;

  await userController.deleteUserById(userId);

  res.redirect('/');
});

router.get('/verifyQuestions', async function(req, res, next) {
  if (!req.session.user ||  req.session.user.admin == 'no') {
    res.redirect('/');
  } else {
    let questionsToVerify = await userController.getQuestionsToVerify();
    res.render('verifyQuestion', {title: "Questions to Verify", user: req.session.user, questionsToVerify: questionsToVerify});
  }
});

router.post('/verifyQuestions', async function(req, res, next) {
  if (!req.session.user ||  req.session.user.admin == 'no') {
    res.redirect('/');
  } else {
    let questionId = req.body.questionId; //get question id
    await userController.submitQuestionsToVerify(questionId);
    res.redirect('/');
  }
});

module.exports = router;
