const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
const mqtt = require('mqtt')
const sensorModel = require('../models/sensor.model');
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
		response.render('./admin', {
		  jsonData,
		  jsonData2
		});
	  });
	});
	
	
});
router.get('/sensor', function(request, response){
	//console.log(request.isAuthenticated());
    sensorModel.listaSensor(function(sensor) {
	response.set("Content-Type", "text/html");
	response.render('./admin_sensor', {
        sensor : sensor
	})
})
	
});

router.post('/registo', function(request, response) {
	var errors = request.validationErrors();	
	
		var data = {
			'id_sensor': request.body.id_sensor,
			'id_tipo': request.body.id_tipo
			
		};
		sensorModel.createSensor(data, function(){
			response.redirect('/sensor');
		});
	
});
module.exports = router;
