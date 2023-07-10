const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// All Admin Routes should only be accessble to logged in Admins!

router.get('/users/:role', async function (req, res, next) {
  let role = req.params.role;
  if (!req.session.user || !req.cookies.isAdmin) {
    res.redirect('/');
  } else {
    let users = await userController.getUsers(role);

    res.render('users', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin, users: users });
  }
});

router.get('/delete/:userId', async function (req, res, next) {
  let userId = req.params.userId;

  await userController.deleteUserById(userId);

  res.redirect('/');
});

module.exports = router;
