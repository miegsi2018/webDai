const express = require('express');
const router = express.Router();
const model = require('../models/user.model');

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());

	response.set("Content-Type", "text/html");
	response.render('./sensor', {
	})


});
module.exports = router;