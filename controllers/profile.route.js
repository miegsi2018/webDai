const express = require('express');
const router = express.Router();

router.get('/', function(request, response){
	//console.log(request.isAuthenticated());

	response.set("Content-Type", "text/html");
	response.render('./profile', {
	})


});
module.exports = router;