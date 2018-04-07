const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
var mqtt = require('mqtt')

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());

  var id = request.user.email;
  var divisoesUser = new Array();
  model.readEmail(id, function(divisoes) {

    console.log('##################################################' + divisoes[0].email + '########');

    /*for (var e of divisoesUser) {
       console.log(e.divisao)
      }
	*/
    var client = mqtt.connect('mqtt://94.61.10.49:80', {
      username: "dai",
      password: '12345678'
    })



    if (divisoes.length > 1) {
      console.log('###############///////////////////////###################(((((((()))))))))))');

      client.on('connect', function() {
        console.log('MQTT IS WORKING' + ' ' + 2)

        for (var e of divisoes) {
          client.subscribe('dai/' + e.divisao)
        }
        client.publish('presence', 'Hello mqtt')




      })
    } else {
      client.on('connect', function() {
        console.log('MQTT IS WORKING' + ' ' + 2)
        client.subscribe('dai/' + divisoes[0].divisao)
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
	response.set("Content-Type", "text/html");
	response.render('./divisao', {
		divisoes : divisoes
	})


});
});

module.exports = router;