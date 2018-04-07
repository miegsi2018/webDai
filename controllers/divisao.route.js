const express = require('express');
const router = express.Router();
const model = require('../models/divisao.model');
var mqtt = require('mqtt')

router.get('/', function(request, response){
  var id = request.user.email;
  
  model.readEmail(id, function(divisoes){  
    response.set("Content-Type", "text/html");
	  response.render('./divisao', {
      divisoes : divisoes
	  })
  })
});

router.get('/:id_divisao', function(request, response){
  var id = request.user.email;
  var sensoresUser = new Array();
  model.readEmail(id, function(divisoes) {

    var client = mqtt.connect('mqtt://94.61.10.49:80', {
      username: "dai",
      password: '12345678'
    })



    if (divisoes.length > 1) {
      console.log('###############///////////////////////###################(((((((()))))))))))');

      client.on('connect', function() {
        console.log('MQTT IS WORKING' + ' ' + 2)

        for (var e of divisoes) {
          client.subscribe('dai/' + e.sensor)
        }
        client.publish('presence', 'Hello mqtt')




      })
    } else {
      client.on('connect', function() {
        console.log('MQTT IS WORKING' + ' ' + 2)
        client.subscribe('dai/' + divisoes[0].sensor)
        client.publish('presence', 'Hello mqtt')
      })
    }
    io.on('connection', function(socket) {

      client.on('message', (topic, message) => {



        console.log(`Received message: '${message}'`);
        socket.emit(topic, message.toString());
        var labels = JSON.parse(message);
        console.log(labels)




      });
    });

  model.readDivisao(request.params.id_divisao, function(divisao){

      response.set("Content-Type", "text/html");
      response.render('./sensor', {
        divisoes : divisoes
      })
  })
})
});

module.exports = router;