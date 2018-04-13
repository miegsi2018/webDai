const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
var mqtt = require('mqtt')
const sensorModel = require('../models/sensor.model');
const divisaoModel = require('../models/divisao.model');



router.get('/', function(request, response){
  //console.log(request.isAuthenticated());
  var id = request.user.email;
  
  divisaoModel.readEmail(id, function(divisoes){  
    sensorModel.listaSensor(function(sensor) {
	response.set("Content-Type", "text/html");
	response.render('./adicionar_sensor', {
        sensor : sensor,
        divisoes : divisoes
	})
})
})
	
});

module.exports = router;
