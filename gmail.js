const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
      
    // Implementation of authentication callback function
  }
));


// Route for initiating OAuth2 authentication
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route for handling callback from Google OAuth2
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to a success page or do further processing
    res.redirect('/success');
  });

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
