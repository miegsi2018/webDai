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

router.get('/room/:id_divisao', function(request, response){
  var id = request.user.email;

  model.readDivisao(request.params.id_divisao, function(divisao){
    if(divisao != undefined){
      response.set("Content-Type", "text/html");
      response.render('./sensor', {
        sensores : sensores
      })
    }
  })
});

module.exports = router;