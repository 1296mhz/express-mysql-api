var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function (req, res, next) {
   res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn, function (req, res) {
   res.json({ message: "ok "})
  // res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function (req, res) {
   req.logout();
   res.redirect('/');
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
   successRedirect: '/profile',
   failureRedirect: '/',
}));

function isLoggedIn(req, res, next) {
   console.log("auth: ", req.isAuthenticated())
   if (req.isAuthenticated()) {
      console.log("auth ok")
      return next();
   }
   res.redirect('/');
}

module.exports = router;


