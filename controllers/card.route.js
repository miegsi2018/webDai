const express = require('express');
const router = express.Router();
const sensorModel = require('../models/sensor.model');
const divisaoModel = require('../models/divisao.model');
const req = require('request');
var userData;
var userData2 = [];

router.get('/:casa', function(request, response){
	//console.log(request.isAuthenticated());
	var id = request.user.email;
	var casa1 = request.params.casa;
	req.get('http://localhost:8080/utilizador', function(error, resp, body) {
	
		req.get('http://localhost:8080/view/'+ id, function(error, resp, body2) {
		jsonData2 = JSON.parse(body2)
		jsonData = JSON.parse(body)
		
		
		
		userData2 = [];
		console.log(jsonData2);
		userData2.push(jsonData2[0]);
		
		var nTotal = 0;
		var Ncasa;
		for (var e of jsonData2) {
				if (casa1 == e.id_house) {

						Ncasa = e.house;

						nTotal = nTotal + 1;


				}
		}
		  for(var i = 1; i < userData2.length; i++){
				
				if(userData2[i].email  !=jsonData2[i].email ){
					userData2.push(jsonData2[i]);
			}
			}
		
console.log(userData2);
	
		response.set("Content-Type", "text/html");
		response.render('./add_card', {
		  id :id,
			casa1: casa1,
		  userData2: userData2,
			jsonData2: jsonData2,
			jsonData: jsonData,
			Ncasa
		});
	  });
	});
});
	

	





module.exports = router; 