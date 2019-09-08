'use strict';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const axios = require('axios');
require('dotenv').config();

/**
 * Exporting Routes of the APP
 * for auth/..../callback route mentioned your successRedirect and failureRedirect
 * 
 * Route - /auth/google => For Google Signin Option
 * Route - /auth/facebook => For Facebook Signin Option
 * Route - /auth/google/callback => Callback Received After SignIn Attempt in Google, Mention Success and Failure Route
 * Route - /auth/facebook/callback => Callback Received After SignIn Attempt in Facebook, Mention Success and Failure Route
 * Route - /auth/facebook/validate => For Validating access_token of facebook, Returns Error in case of service failure or token validation and 
 *         return success and User profile data in case of success.
 * Route - /auth/google/validate => For Validating access_token of Google, returns error in case of service failure and validation failure and 
 *         return user profile in case of success
 */
module.exports = function(app) {
  app.route('/auth/google')
    .get(passport.authenticate('google',{ scope: ['openid','profile','email'] }));
  app.route('/auth/facebook')
    .get(passport.authenticate('facebook',{ authType: 'rerequest', scope: ['user_friends', 'manage_pages'] }));
  app.route('/auth/google/callback')
    .get(passport.authenticate('google', {successRedirect : '/', failureRedirect : '/login'}  ));
  app.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook',{successRedirect : '/',failureRedirect : '/login'}));
  app.route('/logout', function(req,res){
    req.logout();
    res.redirect('/');
  })
  app.route('/auth/facebook/validate')
    .post((req,res)=>{
      validateFacebookAuthToken(req,res);
  });
  app.route('/auth/google/validate')
    .post((req,res) => validateGoogleAuthToken(req,res));
};

/**
 * @param {*} Profile - Profile Object 
 */
function extractGoogleProfile(profile) {
    console.log('Yogesh Joshi',profile);
    let imageUrl = '';
    if (profile.photos && profile.photos.length) {
      imageUrl = profile.photos[0].value;
    }
    return {
      id: profile.id,
      displayName: profile.displayName,
      image: imageUrl,
    };
  }

/**
 * Passport Strategy for OAuth2.0 Google
 */
passport.use('google',new GoogleStrategy(
    {
      clientID: process.env['OAUTH2_CLIENT_ID'],
      clientSecret: process.env['OAUTH2_CLIENT_SECRET'],
      callbackURL: process.env['OAUTH2_CALLBACK'],
      accessType: 'offline',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log('access Token -' ,accessToken);
      return cb(null, extractGoogleProfile(profile));
    }
  )
);
  
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

/**
 * Passport Strategy for Facebook OAuth2.0
 */
passport.use('facebook',new FacebookStrategy({
  clientID: process.env['FACEBOOK_APP_ID'],
  clientSecret: process.env['FACEBOOK_APP_SECRET'],
  callbackURL: process.env['FACEBOOK_CALLBACK'],
  enableProof: true,
  profileFields: ['id', 'displayName', 'photos', 'email','gender','last_name']
},
async (accessToken, refreshToken, profile, cb) => {
    console.log('Access Token ->',accessToken);
    console.log('Profile Data ->',profile);
    return cb(null, profile);
    }
  )
);


/**
* Validate Facebook Token and Retrivel Data
* */
function validateFacebookAuthToken(req,res){
  console.log('Access Token -> ', req.body.access_token);
  axios.get(process.env.FACEBOOK_VALIDATE_URL+req.body.access_token)
    .then(function(response){
      console.log('Validate Response -', response.data);
      res.send(validateFacebookData(response.status,response.data));
    })
    .catch(function(error){
      res.send(validateFacebookData(error.status))
    });
}
function validateFacebookData(status,data){
  if(status == 200)
    return data;
  else 
    return 'Token Not Valid';
}

/**
 * Validate OAuth2.0 Google Token
 */
function validateGoogleAuthToken(req,res){
  console.log('OAuth2.0 Access Token - ', req.body.access_token);
  let accessToken = req.body.access_token;
  axios.get(process.env.GOOGLE_OAUTH_VALIDATE_URL+req.body.access_token)
    .then(function(response){
      console.log('Validate Response - ',response.data);
      axios.get(process.env.GOOGLE_OAUTH_VALIDATE_PLUS_PROFILE,{ headers : {"Authorization" : "Bearer " + accessToken}})
      .then(function(response){
        console.log('Profile Data - ', response.data);
        res.send(response.data);
      })
      .catch(function(error){
        console.log('Error while getting profile data - ', error);
        res.send(error.response.data);
      });
    })
    .catch(function(error){
      console.log('error status -',error.response.status);
      res.send(error.response.data);
  });
}

  