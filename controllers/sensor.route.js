const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://94.61.10.49:80', 
{
	username: "dai",
	password: '12345678'
})

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());


	


client.on('connect', function () {
	console.log('MQTT IS WORKING')
	  client.subscribe('"' + request.user.id_utilizador + '"')
	  client.publish('presence', 'Hello mqtt')
})

io.on('connection', function (socket) {

client.on('message', (topic, message) => {  
	
	

	console.log(`Received message: '${message}'`);
		socket.emit('mqttData',message.toString());
		var labels = JSON.parse(message);
		console.log(labels)
		
		
		var temp = labels["temperature"];
		var luz = labels["brightness"];
		var movimento = labels["motion"];
		 


	
	  });
 });

	response.set("Content-Type", "text/html");
	response.render('./sensor', {	
	})
});
module.exports = router;