const passport = require('passport');
const Id = require('./config').GOOGLE_CLIENT_ID;
const ClientSecret = require('./config').GOOGLE_CLIENT_SECRET;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // User.findById(id, function(err, user) {
    done(null, id);
  // });
});

passport.use(new GoogleStrategy({
    clientID: Id,
    clientSecret: ClientSecret,
    callbackURL: "http://localhost:5000/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(null, profile);
    // });
  }
));