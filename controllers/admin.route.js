const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
var mqtt = require('mqtt')
const sensorModel = require('../models/sensor.model');

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());
	
	response.set("Content-Type", "text/html");
	response.render('./admin', {
	
	})

	
	
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

router.post('/sensor', function(request, response) {
	var errors = request.validationErrors();	
	if (errors) {
		response.render('admin_sensor', {
			isNew: true,
			user: {},
			errors: errors
		});
	}else{
		var data = {
			'id_sensor': request.body.id_sensor,
			'id_tipo': request.body.id_tipo
			
		};
		sensorModel.createSensor(data, function(){
			response.redirect('/admin_sensor');
		});
	}
});
module.exports = router;