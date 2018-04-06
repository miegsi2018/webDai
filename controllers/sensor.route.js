const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
var mqtt = require('mqtt')



router.get('/', function(request, response) {
  //console.log(request.isAuthenticated());


  var id = request.user.email;
  var sensoresUser = new Array();
  model.readEmail(id, function(sensores) {

    console.log('##################################################' + sensores.email + '########');
    sensoresUser = sensores;

    /*for (var e of sensoresUser) {
       console.log(e.sensor)
      }
	*/
    var client = mqtt.connect('mqtt://94.61.10.49:80', {
      username: "dai",
      password: '12345678'
    })


	  
    if (sensores.length > 1) {
console.log('###############///////////////////////###################(((((((()))))))))))');
      for (var e of sensores) {

        client.on('connect', function() {
          console.log('MQTT IS WORKING' + ' ' + 2)
          client.subscribe('dai/' + e.sensor)
          client.publish('presence', 'Hello mqtt')
        })



      }
    } else {
      client.on('connect', function() {
        console.log('MQTT IS WORKING' + ' ' + 2)
        client.subscribe('dai/' + sensores.sensor)
        client.publish('presence', 'Hello mqtt')
      })
    }
    io.on('connection', function(socket) {

      client.on('message', (topic, message) => {



        console.log(`Received message: '${message}'`);
        socket.emit(topic , message.toString());
        var labels = JSON.parse(message);
        console.log(labels)


    

      });
    });

    response.set("Content-Type", "text/html");
    response.render('./sensor', {
   	sensores : sensores 
    
    })
  });
});

module.exports = router;
