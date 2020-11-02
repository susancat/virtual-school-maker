const passport = require('passport');
const LocalStrategy = require("passport-local");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = require("../models/user");

passport.serializeUser((user,done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user =>{
        done(null, user);
    });
});

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
    clientID: "344041127224-g7nnpdvslcfd2orvlovgamnp2mmtcdt3.apps.googleusercontent.com",
    clientSecret: "4fE3bw1QoMfiRt3E_TUJeX3e",
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // console.log(profile)
  const existingUser = await User.findOne({ googleid: profile.id });
  
  if(existingUser) {
      done(null, existingUser);
  } else {
      //new model instance
      const user = await new User({ googleid: profile.id, username:profile.displayName }).save();
      done(null, user);
  }
}
)
);