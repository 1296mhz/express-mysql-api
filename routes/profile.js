var express = require('express');
var router = express.Router();
const isLoggedIn = require('../libs/isLoggedIn');

/* GET USER */
router.get('/', isLoggedIn, async (req, res, next) => {
    res.json({ message: "You authed", user: req.user});
});

module.exports = router;
