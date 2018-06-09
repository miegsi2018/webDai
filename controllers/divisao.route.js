const express = require('express');
const router = express.Router();
const model = require('../models/divisao.model');
var mqtt = require('mqtt');
const req = require('request');
const fileUpload = require('express-fileupload');
var userData;
var Jimp = require("jimp");
router.use(fileUpload());


router.get('/:casa', function (request, response) {
  var id = request.user.email;
  var casa1 = request.params.casa;

  req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
    req.get('http://localhost:8080/house/' + casa1, function(error, resp, body3) {
    
    req.get('http://localhost:8080/division', function (error, resp, body) {
      
      jsonCasa = JSON.parse(body3);
      console.log(jsonCasa.name);
  var nTotal = 0;
  var Ncasa = jsonCasa.name;

  jsonData2 = JSON.parse(body2)
  console.log(jsonData2);

    jsonData2 = JSON.parse(body2);
    jsonDiv = JSON.parse(body);
    console.log("divisões" );

    var nTotal = 0;
    var Ncasa;
    var divi = [];
    for (var e of jsonData2) {
      if (casa1 == e.id_house) {

        Ncasa = e.house;

        nTotal = nTotal + 1;


      }
    }

    for(var d of jsonDiv){
if(d.id_house == casa1){
      divi.push(d);


    }
  }
  console.log("Todas as div da casa" + divi);
  console.log( divi.length == 0 );
    response.set("Content-Type", "text/html");
    response.render('./divisao', {

      id: id,
      casa1: casa1,
      jsonData2: jsonData2,
      Ncasa,
      jsonDiv: jsonDiv, 
      divi, divi
    });
  });
});
});
});
router.post('/:casa/regi', function (request, response) {
  var errors = request.validationErrors();
  var casa1 = request.params.casa;
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var path;
  var teste ;
console.log(request.files.sampleFile)
  if (request.files.sampleFile !== teste) {
 

    let sampleFile = request.files.sampleFile;
console.log("Fase1")
    sampleFile.mv('./public/assets/img/div/' + request.body.name + "-" + request.params.casa + '.jpg', function (err) {
      if (err)
        return response.status(500).send(err);
        console.log("Fase2")

    });
    Jimp.read('./public/assets/img/div/' + request.body.name + "-" + request.params.casa + '.jpg', function (err, lenna) {
      if (err) throw err;
      lenna.resize(480, 320)            // resize
           .quality(100)                 // set JPEG quality
             // set greyscale
           .write('./public/assets/img/div/' + request.body.name + "-" + request.params.casa + '.jpg'); // save
           console.log("imagem resized")
  });
    path = 1;
  } else {
    path = 0;
  }
    var options = {
      uri: 'http://localhost:8080/division',
      method: 'POST',
      json: {
        "id_house": casa1,
        "name": request.body.name,
        "sensor_id": request.body.sensor_id,
        "path": path,
        
      }
    };

  req(options, function (error, resp, body) {
    response.redirect('/room/' + casa1);
  });
});

router.get('/:casa/add', function (request, response) {
  var id = request.user.email;
  var casa1 = request.params.casa;

  req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
    req.get('http://localhost:8080/house/' + casa1, function(error, resp, body) {
      jsonData2 = JSON.parse(body2);
      jsonCasa = JSON.parse(body);
      console.log(jsonCasa.name);
  var nTotal = 0;
  var Ncasa = jsonCasa.name;

  jsonData2 = JSON.parse(body2)
  console.log(jsonData2);

    response.set("Content-Type", "text/html");
    response.render('./adicionar_divisao', {
      id: id, 
      casa1: casa1,
      jsonData2: jsonData2,
      Ncasa
    });
  });
  });
});


router.get('/:id_division/:casa', function (request, response) {
  
  var id = request.user.email;
  var sensoresUser = new Array();
  var casa1 = request.params.casa;
  var division = request.params.id_division;
  

  req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
            req.get('http://localhost:8080/house/' + casa1, function(error, resp, body) {
            jsonData2 = JSON.parse(body2);
            jsonCasa = JSON.parse(body);
            console.log(jsonCasa.name);
        var nTotal = 0;
        var Ncasa = jsonCasa.name;
    
        jsonData2 = JSON.parse(body2)
        console.log(jsonData2);
    jsonData2 = JSON.parse(body2)
    console.log(division);
    var id_sensor;
    var nTotal = 0;
    var Ncasa;
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

    client.on('connect', function () {
      console.log('MQTT IS WORKING' + ' ' + 2)
      client.subscribe('data/' + id_sensor)
      console.log('data/' + id_sensor);
      client.publish('presence', 'Hello mqtt')
    })
    io.on('connection', function (socket) {

      client.on('message', (topic, measurements) => {
        console.log(`Received message: '${measurements}'`);
        socket.emit(topic, measurements.toString());
        var labels = JSON.parse(measurements);
        console.log(labels.measurements)
      });
    });


    var inicial = new Date();
    var final = new Date();
    final.setDate(final.getDate() + 1)
    inicial.setDate(inicial.getDate() - 1);
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
    req(options, function (error, resp, body) {
      console.log(body);
      var a = body;
      for (var t = 0; t < body.temp.length; t++) {
        finalVar = body.temp[t];
        finalVar = finalVar.replace(/^"(.*)"$/, '$1');
        console.log(finalVar);

        graph.push({
          'data': body.data[i],
          'temperature': finalVar
        });

        i++;
      }

      console.log(graph);

      response.set("Content-Type", "text/html");
      response.render('./sensor', {
        id: id,
        casa1: casa1,
        division: division,
        jsonData2: jsonData2,
        id_sensor: id_sensor,
        graph: graph,
        Ncasa
      });
    });
  });
  });
});

router.get('/:id_division/:casa/edit', function (request, response) {
  var id = request.user.email;
  var sensoresUser = new Array();
  var casa1 = request.params.casa;
  var division = request.params.id_division;

  req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
    jsonData2 = JSON.parse(body2)
    console.log(division);
    var id_sensor;
    var nome_divisao;
    var nTotal = 0;
    var Ncasa;
    for (var e of jsonData2) {
      if (casa1 == e.id_house) {

        Ncasa = e.house;

        nTotal = nTotal + 1;


      }
    }
    for (var e of jsonData2) {

      if (division == e.id_division) {

        id_sensor = e.sensor_id;
        nome_divisao = e.division


      }



    }
    console.log(id_sensor);
    console.log(nome_divisao);


    response.set("Content-Type", "text/html");
    response.render('./editar_divisao', {
      id: id,
      casa1: casa1,
      division: division,
      jsonData2: jsonData2,
      id_sensor: id_sensor,
      nome_divisao: nome_divisao,
      Ncasa
    });
  });

});





module.exports = router;