const express = require('express');
const router = express.Router();
const sensorModel = require('../models/sensor.model');
const divisaoModel = require('../models/divisao.model');
const req = require('request');

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());
	var id = request.user.email;
	req.get('http://localhost:8080/utilizador', function(error, resp, body) {
		req.get('http://localhost:8080/view/'+ id, function(error, resp, body2) {
		jsonData = JSON.parse(body);
		jsonData2 = JSON.parse(body2);
		console.log(jsonData);
		console.log(jsonData2);
	response.set("Content-Type", "text/html");
	response.render('./profile', {
		jsonData,
		jsonData2
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