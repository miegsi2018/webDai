const express = require('express');
const router = express.Router();

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());

	response.set("Content-Type", "text/html");
	response.render('./profile', {
	})


});
router.get('/create', function(request, response){
	//console.log(request.isAuthenticated());

	response.set("Content-Type", "text/html");
	response.render('./create_user', {
	})


});
module.exports = router;