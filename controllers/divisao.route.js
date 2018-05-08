const express = require('express');
const router = express.Router();
const model = require('../models/divisao.model');
var mqtt = require('mqtt');
const req = require('request');
var userData;


router.get('/:casa', function(request, response) {
  var id = request.user.email;
  var casa1 = request.params.casa;

  req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {
    jsonData2 = JSON.parse(body2)
    console.log(jsonData2);


    response.set("Content-Type", "text/html");
    response.render('./divisao', {

      id: id,
      casa1: casa1,
      jsonData2: jsonData2
    });
  });
});

router.get('/:casa/add', function(request, response) {
  var id = request.user.email;
  var casa1 = request.params.casa;

  req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {
    jsonData2 = JSON.parse(body2)
    console.log(jsonData2);


    response.set("Content-Type", "text/html");
    response.render('./adicionar_divisao', {
      id: id,
      casa1: casa1,
      jsonData2: jsonData2
    });
  });
});


router.get('/:id_division/:casa', function(request, response) {
  var id = request.user.email;
  var sensoresUser = new Array();
  var casa1 = request.params.casa;
  var division = request.params.id_division;

  req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {
    jsonData2 = JSON.parse(body2)
    console.log(division);
    var id_sensor;
    for (var e of jsonData2) {

      if (division == e.id_division) {

        id_sensor = e.sensor_id;



      } else {



      }


    }
    console.log(id_sensor);
    var client = mqtt.connect('mqtt://94.61.10.49:80', {
      username: "dai",
      password: '12345678'
    })

    client.on('connect', function() {
      console.log('MQTT IS WORKING' + ' ' + 2)
      client.subscribe('data/' + id_sensor)
      console.log('data/' + id_sensor);
      client.publish('presence', 'Hello mqtt')
    })
    io.on('connection', function(socket) {

      client.on('message', (topic, measurements) => {



        console.log(`Received message: '${measurements}'`);
        socket.emit(topic, measurements.toString());
        var labels = JSON.parse(measurements);
        //console.log(labels)

        console.log(labels.measurements)





      });
    });


    var inicial = new Date();

    var final = new Date();

    inicial.setDate(inicial.getDate() - 1);
    var final2 = final.getMilliseconds();
    var graph = [];
    console.log(inicial);
    console.log(final);

    var sensor_formatted = id_sensor.toString();
    var i = 0;

    var options = {
      uri: 'http://localhost:8080/returnGraph',
      method: 'POST',
      json: {
        "dataI": inicial,
        "dataF": final,
        "device": sensor_formatted
      }
    };

    console.log(options.json);

    var finalVar;
    req(options, function(error, resp, body) {
      console.log(body);
      var a = body;
      for (var t = 0; t < body.temp.length; t++) {
	finalVar = body.temp[t];
	finalVar = finalVar.replace(/^"(.*)"$/, '$1');
	console.log(finalVar);

        graph.push({
          'data': body.data[i],
          'temperature':finalVar 
        });

        i++;
      }

      console.log(graph);



      response.set("Content-Type", "text/html");
      response.render('./sensor', {
        id: id,
        casa1: casa1,
        jsonData2: jsonData2,
        id_sensor: id_sensor,
        graph: graph
      });
    });

  });


});


module.exports = router;
