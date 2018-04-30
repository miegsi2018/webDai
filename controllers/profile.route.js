const express = require('express');
const router = express.Router();
const sensorModel = require('../models/sensor.model');
const divisaoModel = require('../models/divisao.model');
const req = require('request');
var userData;
var userData2;

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());
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
		response.render('./profile', {
		  id :id,
		  userData: userData,
		  userData2: userData2,
		  jsonData : jsonData,
		  jsonData2: jsonData2
		});
	  });
	});
	
	});
	



router.get('/create', function(request, response){
	//console.log(request.isAuthenticated());
	var id = request.user.email;

	divisaoModel.readEmail(id, function(divisoes){  
		sensorModel.listaSensor(function(sensor) {
	response.set("Content-Type", "text/html");
	response.render('./create_user', {
		divisoes : divisoes,
		sensor : sensor
	})
})
})


});
module.exports = router; 