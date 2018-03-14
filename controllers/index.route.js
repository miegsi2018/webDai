const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
const swal = require('sweetalert2')

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