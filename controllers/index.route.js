const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
const swal = require('sweetalert2');
const mqtt = require('mqtt');
const req = require('request');
var userData;
var userData2;




router.get('/', function(request, response) {
  //console.log(request.isAuthenticated());
  response.set("Content-Type", "text/html");
  response.render('./login', {

  });


});

router.get('/home', function(request, response, body) {
  //console.log(request.isAuthenticated());
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var id = request.user.email;
  
  req.get('http://localhost:8080/utilizador', function(error, resp, body) {
    req.get('http://localhost:8080/view/'+ id, function(error, resp, body2) {
    jsonData = JSON.parse(body);
    jsonData2 = JSON.parse(body2);
    console.log(jsonData);
    console.log(jsonData2);
    userData = jsonData;
    userData2 = jsonData2;
   for(var i = 0; i < jsonData.length; i++){
      if(jsonData[i].email = id ){
   userData = jsonData[i];
      }
      }
      for(var i = 0; i < jsonData2.length; i++){
        if(jsonData2[i].email = id ){
     userData2 = jsonData2[i];
        }
        }
    response.set("Content-Type", "text/html");
    response.render('./index', {
      id :id,
      userData: userData,
      userData2: userData2,
      jsonData,
      jsonData2
    });
  });
});

});


router.get('/registo', function(request, response) {
  //console.log(request.isAuthenticated());

  response.set("Content-Type", "text/html");
  response.render('./registo', {});


});

router.post('/registo', function(request, response) {
  var errors = request.validationErrors();
  if (errors) {
    response.render('registo', {
      isNew: true,
      user: {},
      errors: errors
    });
  } else {
    var data = {
      'username': request.body.username,
      'password': request.body.password,
      'email': request.body.email
    };
    model.create(data, function() {
      response.redirect('/profile');
    });
  }
});

router.post('/', function(request, response) {

  var data = {
    'email': request.body.email,
    'password': request.body.password
  }

  if(req.post('http://localhost:8080/login', {form: data})){
    request.login(request.body.email, function(err) {

      response.redirect('/home');
    });
  } else {
    response.json({
      error: "Updated Successfully",
      status: 400
    });
  }
});

module.exports = router;
