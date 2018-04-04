const express = require('express');
const router = express.Router();

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());

	response.set("Content-Type", "text/html");
	response.render('./room', {
	})


});
router.get('/sensor', function(request, response){
	//console.log(request.isAuthenticated());

	response.set("Content-Type", "text/html");
	response.render('./sensor', {
	})


});
module.exports = router;