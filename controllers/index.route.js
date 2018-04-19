const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
const swal = require('sweetalert2');
const mqtt = require('mqtt');
const req = require('request');




router.get('/', function(request, response) {
  //console.log(request.isAuthenticated());
  response.set("Content-Type", "text/html");
  response.render('./login', {

  });


});

router.get('/home', function(request, response) {
  //console.log(request.isAuthenticated());
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var id = request.user.email;

req.get('http://localhost:8080/view/'+ id, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});



  response.set("Content-Type", "text/html");
  response.render('./index', {


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

  model.areValidCredentials(request.body.email, request.body.password, function(areValid) {
    if (areValid) {
      //Create the login session

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
});


/*
router.post('/', function(request, response) {
		var errors = request.validationErrors();
		
		if (errors) {
			response.render('login', { errors: errors });
			return;
		}
		model.areValidCredentials(request.body.email, request.body.password, function(areValid) {
			if (areValid) {
				//Create the login session
				request.login(request.body.email, function(err) {
					response.redirect('/home');
				});		
			}else{
				response.render('login', { errors: [
					{ msg: 'Invalid credentials provided' }
				]});
			}
		});
});*/

module.exports = router;
