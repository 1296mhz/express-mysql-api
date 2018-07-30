var express = require("express");
var passport = require("passport");
var router = express.Router();
const path = require('path');

const isLoggedIn = require("../libs/isLoggedIn");

router.get(
  "/", isLoggedIn, function(req, res, next) {
  console.log("Клиент: ");
  console.log(req.user);

  
let p = path.normalize(__dirname + '/..')
   // console.log(path.join(p, 'dist'))
 // express.static(path.join(p, 'dist'));
  res.sendFile(p + "/dist/index.html");
});

router.get(
  "/enter", function(req, res) {
  console.log("Enter: ", req.user);
  res.render("index", { title: "Vox" });
});

router.get(
  "/profile", isLoggedIn, function(req, res) {
  res.json({ message: "You authed", user: req.user });
});

router.get(
  "/logout", function(req, res) {
  req.logout();
  res.redirect("/enter");
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/enter"
  })
);

module.exports = router;
