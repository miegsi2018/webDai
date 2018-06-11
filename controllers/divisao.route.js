const express = require('express');
const router = express.Router();
const model = require('../models/divisao.model');
const fileUpload = require('express-fileupload');
var mqtt = require('mqtt');
const req = require('request');
var userData;
router.use(fileUpload());


router.get('/:casa', function(request, response) {
    var id = request.user.email;
    var casa1 = request.params.casa;

    req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {
        req.get('http://localhost:8080/house/' + casa1, function(error, resp, body3) {

            req.get('http://localhost:8080/division', function(error, resp, body) {

                jsonCasa = JSON.parse(body3);
                console.log(jsonCasa.name);
                var nTotal = 0;
                var Ncasa = jsonCasa.name;

                jsonData2 = JSON.parse(body2)
                console.log(jsonData2);

                jsonDivi = JSON.parse(body); 
                console.log("divisões");
var id_sensor;
                var divi = [];
                for (var e of jsonData2) {
                    if (casa1 == e.id_house) {

                        Ncasa = e.house;

                        nTotal = nTotal + 1;


                    }
                }

                for (var d of jsonDivi) {
                    if (d.id_house == casa1) {
                        divi.push(d);


                    }
                }
                // for (var e of jsonDivi) {

                //     if (division == e.id_division) {
                //       console.log("it workt:" + e.sensor_id);
                //       id_sensor = e.sensor_id;
                //     }
          
                //   }    console.log("acabou fazes iniciais")
               
            //       var client = mqtt.connect('mqtt://alvesvitor.ddns.net:80', {
            //         username: "dai",
            //         password: '12345678'
            //       })
                 

            //     for(var i = 0; i < jsonData2.length; i++){
            //         if(jsonData2[i].id_house == casa1){
            //             console.log("sensor: " + jsonData2[i].sensor_id)
            //             id_sensor = e.sensor_id;
            //       console.log("Inicio faze cliente")
            //       client.on('connect', function () {
            //      console.log("it workt:" + id_sensor);
                      
            //         console.log('MQTT IS WORKING' + ' ' + 2)
            //         client.subscribe('data/' +id_sensor)
            //         console.log('data/' + id_sensor);
            //         client.publish('presence', 'Hello mqtt')
            //       })
               
            //       io.on('connection', function (socket) {
          
            //         client.on('message', (topic, measurements) => {
            //           console.log(`Received message: '${measurements}'`);
            //           socket.emit(topic, measurements.toString());
            //           var labels = JSON.parse(measurements);
            //           console.log(labels.measurements)
            //         });
            //       });
            //     }
            // }
          
              
                response.set("Content-Type", "text/html");
                response.render('./divisao', {

                    id: id,
                    casa1: casa1,
                    jsonData2: jsonData2,
                    Ncasa,
                    jsonDivi: jsonDivi,
                    divi
                });
            });
        });
    });
});




















router.post('/:casa/regi', function(request, response) {
    var errors = request.validationErrors();
    var casa1 = request.params.casa;
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var path;
    var teste = 0;
    // if (!request.files)
    //     return response.status(400).send('No files were uploaded.');

    // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    // let sampleFile = request.files.sampleFile;

    // // Use the mv() method to place the file somewhere on your server
    // sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    //     if (err)
    //         return response.status(500).send(err);

    //     response.send('File uploaded!');
    // });
    var options = {
        uri: 'http://localhost:8080/division',
        method: 'POST',
        json: {
            "id_house": casa1,
            "name": request.body.name,
            "sensor_id": 0,
            "path": path,

        }
    };

    req(options, function(error, resp, body) {
        response.redirect('/room/' + casa1);
    });
});


router.get('/:casa/add', function (request, response) {
    var id = request.user.email;
    var casa1 = request.params.casa;
  
    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
      req.get('http://localhost:8080/house/' + casa1, function (error, resp, body) {
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
          isNew: true,
          casa1: casa1,
          jsonData2: jsonData2,
          Ncasa
        });
    });
});
});
router.get('/:casa/:id_division/edit', function (request, response) {
    var id = request.user.email;
    var casa1 = request.params.casa;
  
    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
      req.get('http://localhost:8080/house/' + casa1, function (error, resp, body) {
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
          isNew: false,
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
    req.get('http://localhost:8080/house/' + casa1, function (error, resp, body) {
      req.get('http://localhost:8080/division', function (error, resp, body3) {
        jsonData2 = JSON.parse(body2);
        jsonCasa = JSON.parse(body);
        jsonDivi = JSON.parse(body3);
        var divi = [];

        var nTotal = 0;
        var Ncasa = jsonCasa.name;

        var id_sensor;
        var Ncasa;
        for (var e of jsonDivi) {

          if (division == e.id_division) {
            console.log("it workt:" + e.sensor_id);
            id_sensor = e.sensor_id;
          }

        }
        console.log("acabou fazes iniciais")
        console.log(id_sensor);
        var client = mqtt.connect('mqtt://alvesvitor.ddns.net:80', {
          username: "dai",
          password: '12345678'
        })
        console.log("Inicio faze cliente")
        client.on('connect', function () {
          console.log('MQTT IS WORKING' + ' ' + 2)
          client.subscribe('data/' + id_sensor)
          console.log('data/' + id_sensor);
          client.publish('presence', 'Hello mqtt')
        })
        console.log("Log intermedio")
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
});

router.get('/:id_division/:casa/edit', function(request, response) {
    var id = request.user.email;
    var sensoresUser = new Array();
    var casa1 = request.params.casa;
    var division = request.params.id_division;

    req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {
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
