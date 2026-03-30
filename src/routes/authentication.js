const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth'); //Metodo para proteger las rutas

// SIGNUP
router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', isNotLoggedIn, (req, res) => {
  res.render('auth/signin');
});

router.post(
  '/signin', isNotLoggedIn,
  [
    body('username').notEmpty().withMessage('Username is Required'),
    body('password').notEmpty().withMessage('Password is Required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('message', errors.array()[0].msg);
      return res.redirect('/signin');
    }

    passport.authenticate('local.signin', {
      successRedirect: '/profile',
      failureRedirect: '/signin',
      failureFlash: true
    })(req, res, next);
  }
);

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

module.exports = router;