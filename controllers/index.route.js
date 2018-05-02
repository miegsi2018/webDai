const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
const swal = require('sweetalert2');
const mqtt = require('mqtt');
const req = require('request');
var userData;
var userData2= [];
var casa = [];




router.get('/', function(request, response) {
  //console.log(request.isAuthenticated());
  response.set("Content-Type", "text/html");
  response.render('./login', {

  });


});

router.get('/house', function(request, response, body) {
  //console.log(request.isAuthenticated());
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var id = request.user.email;
  
  req.get('http://localhost:8080/view/'+ id, function(error, resp, body2) {
    jsonData2 = JSON.parse(body2);
    userData2 = jsonData2;
    var userData2= [];
var casa = [];
      for(var i = 0; i < jsonData2.length; i++){
        if(jsonData2[i].email === id ){
 casa.push(jsonData2[i].house);
        }
        }
    response.set("Content-Type", "text/html");
    response.render('./house', {
      id :id,
      casa :  casa
    });
  });

});


router.get('/home/:casa', function(request, response, body) {
  //console.log(request.isAuthenticated());
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var id = request.user.email;
  var casa1 = request.params.casa;

  req.get('http://localhost:8080/utilizador', function(error, resp, body) {
  
    jsonData = JSON.parse(body);
 
    userData = jsonData;
   
   for(var i = 0; i < jsonData.length; i++){
      if(jsonData[i].email = id ){
   userData = jsonData[i];
      }
      }
      
    response.set("Content-Type", "text/html");
    response.render('./index', {
      id :id,
      userData: userData,
      jsonData: jsonData,
      casa1 :  casa1
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

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var options = {
    uri: 'http://localhost:8080/utilizador',
    method: 'POST',
    json : {
      "username": request.body.username,
      "password": request.body.password,
      "email": request.body.email,
      "type": "user"
    }
  };

  req(options, function (error, resp, body){ 
    response.redirect('/');
  });
  
  response.redirect('/');
});

router.post('/', function(request, response) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var options = {
    uri: 'http://localhost:8080/login',
    method: 'POST',
    json : {
      "email": request.body.email,
      "password": request.body.password
    }
  };


  req(options, function (error, resp, body){ 
    if(body.password == request.body.password){
      request.login(body.email, function(err){
        response.redirect('/house');
      });
    }else{
      response.json({
        error: "Updated Successfully",
        status: 400
      });
    }
  });
});

module.exports = router;
