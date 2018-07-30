function isLoggedIn(req, res, next) {
    console.log("auth: ", req.isAuthenticated())
    if (req.isAuthenticated()) {
       console.log("auth ok")
       return next();
    }
    console.log("Redirect to enter")
    res.redirect('/enter');
 }

 module.exports = isLoggedIn