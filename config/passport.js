var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();
var GoogleUserAdapter = require('../connectors/GooglUserAdapter');

const googleUserAdapter = new GoogleUserAdapter({
   "host": process.env.MYSQL_HOST,
   "port": process.env.MYSQL_PORT,
   "database": process.env.MYSQL_DATABASE,
   "user": process.env.MYSQL_USER,
   "password": process.env.MYSQL_PASSWORD,
   "multipleStatements": true,
   // "timezone": "+00:00",
   // "dateStrings": true
});

var configAuth = require('./auth');

module.exports = function (passport) {

   passport.serializeUser(function (user, done) {
      done(null, user.id);
   });

   passport.deserializeUser(async function(id, done) {
    
         console.log("Desirialize")
         console.log(id)
         var user = await googleUserAdapter.GetUserById(id);
         console.log("Desirialize User: " + user[0])
   
         if (!user) {
            console.log("Пусто")
            let err = null;
            done(err);
         } else {
            console.log("user exist!")
            let err = null
            done(err, user[0]);
         }
     
   });

   passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
   },
      async function(token, refreshToken, profile, done) {

         const user = await googleUserAdapter.GetUserById(profile.id);
         console.log("Profile: ")
         console.log(profile.photos[0])
         if (user.length > 0) {
            let u = user[0]
            return done(null, u);
         } else {
            try {
               let newUser = {};
               newUser.id = profile.id;
               newUser.token = token;
               newUser.name = profile.displayName;
               newUser.email = profile.emails[0].value;
               newUser.photo = profile.photos[0].value;

               const result = await googleUserAdapter.AddUser(newUser);
               if(result.affectedRows === 1){
                  let newUserResult = await googleUserAdapter.GetUserById(profile.id);
                  
                  newUserResult = newUserResult[0]
                  console.log("Create new user: ")
                  console.log(newUserResult)
                  return done(null, newUserResult);
               }
            } catch (err) {
               throw err;
            }
         }

      }));

};
