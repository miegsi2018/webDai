const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
const swal = require('sweetalert2')
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://94.61.10.49:8883', 
	{
		username: "dai",
	 password: '12345678'
	})
//var client = mqtt.connect('mqtt://localhost:1883'); 
client.on('connect', function () {
	console.log('fuck')
  client.subscribe('3')
  client.publish('presence', 'Hello mqtt')
})
io.on('connection', function (socket) {

client.on('message', (topic, message) => {  
	
	console.log(message)
	console.log(`Received message: '${message}'`);

		socket.emit('mqttData',message.toString());
	
	  });
 });


router.get('/', function(request, response){
	//console.log(request.isAuthenticated());
	

	response.set("Content-Type", "text/html");
	response.render('./login', {
		
	})


});

router.get('/home', function(request, response){
	//console.log(request.isAuthenticated());

	response.set("Content-Type", "text/html");
	response.render('./index', {	
		
		
	})


});

router.get('/registo', function(request, response){
	//console.log(request.isAuthenticated());

	response.set("Content-Type", "text/html");
	response.render('./registo', {
	})


});
module.exports = router;