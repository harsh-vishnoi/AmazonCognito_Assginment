var express = require('express');
var router = express.Router();
var jsdom = require('jsdom');
global.fetch = require('node-fetch');
var $ = require('jquery')(new jsdom.JSDOM().window);
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
   UserPoolId: "ap-south-1_C4eZ9pCOn",
   ClientId: "74iqf2bioc1df14se34v30jpn0"
};
const pool_region = "ap-south-1";
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.get('/', function(req, res) {
    res.sendFile(__dirname + '/Src/Dashboard.html');
});

router.get('/signUp', function (req, res) {
  res.sendFile(__dirname + '/Src/signup.html');
});

router.post('/signUp', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  if(password !== confirmpassword){
    return res.redirect('/signUp');
  }

  const emailData = {
    Name : "email",
    Value : email
  };

  const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(emailData);

  userPool.signUp(email, password, [ emailAttribute ], null, function (err, result) {
    if (err){
        console.error(err);
        return res.redirect('/signUp');
    }
    res.redirect('/');
  })

});

router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/Src/Login.html');
});

router.post('/login', (req, res) => {
  const loginDetails = {
    Username : req.body.email,
    Password : req.body.password
  }

  console.log(loginDetails);

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails);

  var userDetails = {
     Username: req.body.email,
     Pool: userPool
  }

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails);
  cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
          console.log('access token + ' + result.getAccessToken().getJwtToken());
          console.log('id token + ' + result.getIdToken().getJwtToken());
          console.log('refresh token + ' + result.getRefreshToken().getToken());
          res.redirect('/');
      },
      onFailure: function(err) {
          console.log(err);
          res.redirect('/login');
      },
   })

});

module.exports = router;
