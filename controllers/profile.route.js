const express = require('express');
const router = express.Router();
const sensorModel = require('../models/sensor.model');
const divisaoModel = require('../models/divisao.model');

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());

	response.set("Content-Type", "text/html");
	response.render('./profile', {
	})


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