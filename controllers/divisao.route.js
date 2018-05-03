const express = require('express');
const router = express.Router();
const model = require('../models/divisao.model');
var mqtt = require('mqtt');
const req = require('request');
var userData;
var userData2;

router.get('/:casa', function(request, response){
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
	  response.render('./divisao', {

      id :id,
			casa1: casa1,
		  userData2: userData2,
		  jsonData2: jsonData2
		});
	  });
  });
  
router.get('/add', function(request, response){
  //console.log(request.isAuthenticated());

    var id = request.user.email;
   
  model.readEmail(id, function(divisoes){  
    response.set("Content-Type", "text/html");
	  response.render('./adicionar_divisao', {
      divisoes : divisoes
	  })
  })

});


router.get('/:id_division/:casa', function(request, response){
  var id = request.user.email;
  var sensoresUser = new Array();
  var casa1 = request.params.casa;
  req.get('http://localhost:8080/view/'+ id, function(error, resp, body2) {
    jsonData2 = JSON.parse(body2)
  
  
    userData2 = jsonData2;
      for(var i = 0; i < jsonData2.length; i++){
      if(jsonData2[i].email = id ){
     userData2 = jsonData2[i];
      }
      }

    var client = mqtt.connect('mqtt://94.61.10.49:80', {
      username: "dai",
      password: '12345678'
    })



    if (jsonData2.length > 1) {
      console.log('###############///////////////////////###################(((((((()))))))))))');

      client.on('connect', function() {
        console.log('MQTT IS WORKING' + ' ' + 2)

        for (var e of jsonData2) {
          client.subscribe('data/' + e.sensor_id )
        }
        client.publish('presence', 'Hello mqtt')




      })
    } else {
      client.on('connect', function() {
        console.log('MQTT IS WORKING' + ' ' + 2)
        client.subscribe('data/' + jsonData2[0].sensor_id)
        client.publish('presence', 'Hello mqtt')
      })
    }
    io.on('connection', function(socket) {

      client.on('message', (topic, measurements) => {



        console.log(`Received message: '${measurements}'`);
        socket.emit(topic, measurements.toString());
        var labels = JSON.parse(measurements);
        //console.log(labels)
       
        console.log( labels.measurements)
        




      });
    });



      response.set("Content-Type", "text/html");
      response.render('./sensor', {
        id :id,
        casa1: casa1,
        userData2: userData2,
        jsonData2: jsonData2
   
  });
});
});


module.exports = router;