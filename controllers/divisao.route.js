const express = require('express');
const router = express.Router();
const model = require('../models/divisao.model');
const fileUpload = require('express-fileupload');
var mqtt = require('mqtt');
const req = require('request');
var userData;
router.use(fileUpload());


router.get('/:casa', global.secure(), function (request, response) {
    var id = request.user.email;
    var casa1 = request.params.casa;

    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
        req.get('http://localhost:8080/house/' + casa1, function (error, resp, body3) {

            req.get('http://localhost:8080/division', function (error, resp, body) {

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




















router.post('/:casa/regi', function (request, response) {
    var errors = request.validationErrors();
    var casa1 = request.params.casa;
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var path = 0;
    var teste = 0;

    var options = {
        uri: 'http://localhost:8080/division',
        method: 'POST',
        json: {
            "id_house": casa1,
            "name": request.body.name,
            "sensor_id": request.body.sensor,
            "path": path,

        }
    };

    req(options, function (error, resp, body) {


        console.log(resp);
        response.redirect('/home/' + casa1);
    });
});


router.get('/:casa/add', global.secure(), function (request, response) {
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

router.get('/:casa/:id_division/edit', global.secure(), function (request, response) {
    var id = request.user.email;
    var casa1 = request.params.casa;
    var divisao = request.params.id_division;

    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
        req.get('http://localhost:8080/division', function (error, resp, body) {
            req.get('http://localhost:8080/house/' + casa1, function (error, resp, body3) {

                jsonData2 = JSON.parse(body2);
                jsonDivi = JSON.parse(body);
                jsonCasa = JSON.parse(body3);
                var Ncasa = jsonCasa.name;
                var editavel = [];
                for (var c of jsonDivi) {
                    if (divisao == c.id_division)
                        editavel.push(c);
                    console.log("funciona")


                }
                console.log(editavel)
                console.log(casa1)
                var nome = editavel[0].name;
                var sensor = editavel[0].sensor_id;


                response.set("Content-Type", "text/html");
                response.render('./adicionar_divisao', {
                    id: id,
                    isNew: false,
                    casa1: casa1,
                    jsonData2: jsonData2,
                    Ncasa,
                    nome: nome,
                    sensor: sensor,
                    divisao: divisao
                });
            });
        });
    });
});


router.post('/:casa/:id_division/edit', function (request, response) {
    var errors = request.validationErrors();
    var casa1 = request.params.casa;
    var divisao = request.params.id_division;
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var path = 0;
    var teste = 0;

    var options = {
        uri: 'http://localhost:8080/division/name',
        method: 'POST',
        json: {
            "id_division": divisao,
            "name": request.body.name,
            "sensor_id": request.body.sensor,


        }
    };

    req(options, function (error, resp, body) {
        response.redirect('/home/' + casa1);
    });
});
router.post('/:casa/delete', function (request, response) {

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id_casa = request.params.casa;
    var options = {
        uri: 'http://localhost:8080/house/delete/228',
        method: 'DELETE',
        json: {


        }


    };

    response.redirect('/house')

});

router.get('/:id_division/:casa', global.secure(), function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");



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
                var arm;
                for (var e of jsonDivi) {

                    if (division == e.id_division) {
                        console.log("it workt:" + e.sensor_id);
                        id_sensor = e.sensor_id;
                        arm = e.armed;
                    }

                }
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
		    
		io.origins('*:*') // for latest version
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

                var avgTemp = {
                    uri: 'http://localhost:8080/avgTemp',
                    method: 'POST',
                    json: {
                        "dataI": inicial,
                        "dataF": final,
                        "device": sensor_formatted
                    }
                };

                var avgHum = {
                    uri: 'http://localhost:8080/avgHum',
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
			var finalTemp = body.data[i];
			 finalTemp = finalTemp.substring(10,19);
                        console.log(finalVar);

                        graph.push({
                            'data': finalTemp,
                            'temperature': finalVar
                        });

                        i++;
                    }

                    req(avgTemp, function (error, resp, body) {
                        var avgTemp = body;

                        req(avgHum, function (error, resp, body) {
                            var avgHum = body;
                            response.set("Content-Type", "text/html");
                            response.render('./sensor', {
                                id: id,
                                casa1: casa1,
                                division: division,
                                jsonData2: jsonData2,
                                id_sensor: id_sensor,
                                graph: graph,
                                Ncasa,
                                arm: arm,
                                avgTemp: avgTemp.toFixed(2),
                                avgHum: avgHum.toFixed(2)
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get('/:id_division/:casa/edit', global.secure(), function (request, response) {
    var id = request.user.email;
    var sensoresUser = new Array();
    var casa1 = request.params.casa;
    var division = request.params.id_division;

    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
        jsonData2 = JSON.parse(body2)
        console.log(division);
        var id_sensor;
        var nome_divisao;
        var id_casa;
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
                nome_divisao = e.division;
                id_casa = e.id_house;


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
            id_casa: id_casa,
            Ncasa
        });
    });

});


router.post('/:id_division/:casa/delete', function (request, response) {

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id_casa = request.params.casa;
    var id_division = request.params.id_division;
    console.log("tentativa inicial" + id_division)

    var options = {
        uri: 'http://localhost:8080/division/delete/' + id_division,
        method: 'POST',
        json: {


        }

    };
    req(options, function (error, resp, body) {

    })
    console.log("tentativa final")
    response.redirect('/home/' + id_casa)

});

router.post('/addQR', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('---------------------------------------------------' + request.body.id_division + '\\\\\\' + request.body.sensor_id);
    var options = {
        uri: "http://localhost:8080/division/" + request.body.id_division,
        method: "POST",
        json: {
            "sensor_id": request.body.sensor_id,
            "id_division": request.body.id_division
        }
    }

    req(options, function (error, resp, body) {
        response.redirect('/house')
    })
});

router.post('/addnewroom', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('------------HOUSE: ' + request.body.id_house + '||||| SENSOR: ' + request.body.sensor_id + '||||| NAME: ' + request.body.name);
    var options = {
        uri: "http://localhost:8080/division/",
        method: "POST",
        json: {
            "id_house": request.body.id_house,
            "name": request.body.name,
            "sensor_id": request.body.sensor_id
        }
    }

    req(options, function (error, resp, body) {
        response.redirect('/house')
    })
});

router.post('/turnRelay', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var options = {
        uri: "http://localhost:8080/changeLight",
        method: "POST",
        json: {
            "topic": request.body.topic,
            "message": request.body.message
        }
    }

    req(options, function (error, resp, body) {

    })
});

router.post('/turnAlarm', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var options = {
        uri: "http://localhost:8080/division/arm",
        method: "POST",
        json: {
            "id_division": request.body.id_division,
            "armed": request.body.armed
        }
    }

    req(options, function (error, resp, body) {

    })
});

module.exports = router;
