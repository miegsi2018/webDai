const express = require('express');
const router = express.Router();
const sensorModel = require('../models/sensor.model');
const divisaoModel = require('../models/divisao.model');
const req = require('request');
var userData;
var userData2;

router.get('/:casa', function(request, response){
	//console.log(request.isAuthenticated());
	var id = request.user.email;
	var casa1 = request.params.casa;
	
		req.get('http://localhost:8080/view/'+ id, function(error, resp, body2) {
		jsonData2 = JSON.parse(body2)
		console.log(jsonData2);

		userData2 = jsonData2;
		  for(var i = 0; i < jsonData2.length; i++){
			if(jsonData2[i].email = id ){
		 userData2 = jsonData2[i];
			}
			}
		response.set("Content-Type", "text/html");
		response.render('./profile', {
		  id :id,
			casa1: casa1,
		  userData2: userData2,
		  jsonData2: jsonData2
		});
	  });
	});
	

	



router.get('/:casa/create', function(request, response){
	//console.log(request.isAuthenticated());
	var id = request.user.email;
	var casa1 = request.params.casa;
	req.get('http://localhost:8080/view/'+ id, function(error, resp, body2) {
		jsonData2 = JSON.parse(body2)
		console.log(jsonData2);

		userData2 = jsonData2;
		  for(var i = 0; i < jsonData2.length; i++){
			if(jsonData2[i].email = id ){
		 userData2 = jsonData2[i];
			}
			}
	response.set("Content-Type", "text/html");
	response.render('./create_user', {
		id :id,
		casa1: casa1,
	  userData2: userData2,
	  jsonData2: jsonData2
	});
  });
});




module.exports = router; 