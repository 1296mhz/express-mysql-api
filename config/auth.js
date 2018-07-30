require('dotenv').config();

console.log("Process env")
console.log(process.env);

module.exports = {
  googleAuth: {
    clientID: process.env.GOOGLE_AUTH_CLIENTID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENTSECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACKURL,
  }
};
