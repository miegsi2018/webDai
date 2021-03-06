const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
const swal = require('sweetalert2');
const mqtt = require('mqtt');
const req = require('request');
const fileUpload = require('express-fileupload');
var userData;
var casa = [];
var Jimp = require("jimp");
router.use(fileUpload());



router.get('/', function (request, response) {

    response.set("Content-Type", "text/html");
    response.render('./frontpage', {});

});

// ROTA DA FRONT PAGE
router.get('/login', function (request, response) {
    //console.log(request.isAuthenticated());

    var inicial = new Date();

    var final = new Date();

    inicial.setDate(inicial.getDate() - 1);
    var final2 = final.getMilliseconds();
    var graph = [];
    console.log(inicial);
    console.log(final);


    var i = 0;

    var options = {
        uri: 'http://localhost:8080/returnGraph',
        method: 'POST',
        json: {
            "dataI": inicial,
            "dataF": final
        }
    };

    console.log(options.json);

    req(options, function (error, resp, body) {
        console.log(body);
        var a = body;
        for (var t = 0; t < body.temp.length; t++) {

            console.log(body.data[i]);
            i++;
            graph.push({
                'data': body.data[i],
                'temperature': body.temp[t]
            });

            console.log(graph);
        }
    });

    response.set("Content-Type", "text/html");
    response.render('./login', {
        error: ""
    });


});







router.post('/add/add/:id_sensor', global.secure(), function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    console.log(request.params.id_sensor);

    var id_sensor = request.params.id_sensor;
    var options = {
        uri: 'http://localhost:8080/division/' + request.body.division,
        method: 'POST',
        json: {


            "sensor_id": id_sensor,
            "id_house": request.body.house,
            "id_division": request.body.division
        }
    };

    console.log(options.uri);

    req(options, function () {});

    response.redirect('/house');

});
















router.get('/add/:id_sensor/:type', global.secure(), function (request, response) {



    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id_user = request.user.email;
    var id_sensor = request.params.id_sensor;
    var type = request.params.type;
    var id_account = request.user.account;
    console.log(id_user);

    console.log(id_account);
    console.log(id_sensor);




    var graph = [];

    req.get('http://localhost:8080/view2/' + id_user + '/' + id_account, function (error, resp, body) {



        parsed = JSON.parse(body);
        console.log(parsed);
        var id_house = parsed.array2.id_houses;
        console.log(id_house);

        var id_division = parsed.id_division;

        var house = parsed.array2.houses;
        console.log(house);

        var division = parsed.division;

        response.set("Content-Type", "text/html");

        response.render('./adicionar_sensor', {
            house: house,

            id_house: id_house,
            division: division,
            id_division: id_division,
            id_sensor: id_sensor,

            type: type,

            casa1: "Nova Casa",
            id: id_user,
            Ncasa: "Nova Casa"
        });

    });

});























// ROTA DA PAGINA DAS CASAS DO UTILIZADOR
router.get('/house', global.secure(), function (request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var id = request.user.email;
    var id_user = request.user.id_user;
    var account = request.user.account;

    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
        req.get('http://localhost:8080/house/', function (error, resp, body) {
            req.get('http://localhost:8080/utilizador/' + id_user, function (error, resp, body3) {
                jsonData2 = JSON.parse(body2);
                jsonCasa = JSON.parse(body);
                jsonUser = JSON.parse(body3);

                var casa = [];
                var casaN = [];
                var ca = 0;
                if (jsonData2.length >= 1) {
                    casa.push(jsonData2[0].id_house);

                    casaN.push(jsonData2[0].house);


                }
                for (var i = 0; i < jsonCasa.length; i++) {
                    if (jsonCasa[i].account_id == account) {
                        ca = ca + 1;
                    }

                }



                response.set("Content-Type", "text/html");
                response.render('./house', {
                    id: id,
                    casa: casa,
                    casaN: casaN,
                    jsonData2: jsonData2,
                    jsonCasa: jsonCasa,
                    account: account,
                    ca: ca,

                });
            });
        });
    });

});




router.get('/house/create', global.secure(), function (request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = request.user.email;

    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {

        jsonData2 = JSON.parse(body2);


        var casa = [];
        for (var i = 0; i < jsonData2.length; i++) {
            if (jsonData2[i].email === id) {
                casa.push(jsonData2[i].house);
            }
        }
        response.set("Content-Type", "text/html");
        response.render('./create_house', {
            id: id,
            isNew: true,

            casa: casa
        });
    });

});


router.post('/house/create', function (request, response, body) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var errors = request.validationErrors();
    var id = request.user.account;
    var path;
    var teste;

    var name = request.body.name;
    var newName = name.replace(/\s+/g, '');
    var newAccount = request.user.account;

    var options = {
        uri: 'http://localhost:8080/house',
        method: 'POST',
        json: {
            "name": request.body.name,
            "account_id": id,
            "path": 0
        }
    }


    req(options, function (error, resp, body) {
        console.log(resp);

        response.redirect('/house');

    });

});


router.get('/house/edit/:casa', global.secure(), function (request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = request.user.email;
    var casa1 = request.params.casa;

    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
        req.get('http://localhost:8080/house/', function (error, resp, body) {
            jsonData2 = JSON.parse(body2);
            jsonCasa = JSON.parse(body);
            var editavel = [];
            for (var c of jsonCasa) {
                if (casa1 == c.id_house)
                    editavel.push(c);


            }

            console.log(editavel);
            response.set("Content-Type", "text/html");
            response.render('./create_house', {
                isNew: false,
                id: id,
                casa1: casa1,
                editavel: editavel


            });
        });
    });

});


router.post('/house/edit/:casa', function (request, response, body) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var errors = request.validationErrors();
    var id = request.user.account;
    var casa1 = request.params.casa;
    req.get('http://localhost:8080/house/', function (error, resp, body) {
        jsonCasa = JSON.parse(body);
        var editavel = [];
        for (var c of jsonCasa) {
            if (casa1 == c.id_house)
                editavel.push(c);
            console.log("funciona")


        }
        console.log(editavel)
        console.log(casa1)
        console.log(jsonCasa[0].account_id)
        var account = editavel[0].account_id;
        var path = editavel[0].path;
        var nome = editavel[0].name;
        console.log(request.body.name)



        var options = {
            uri: 'http://localhost:8080/house/' + casa1,
            method: 'POST',
            json: {
                "id_house": casa1,
                "name": request.body.name,
                "account_id": account,
                "path": path,
            }
        }

        req(options, function (error, resp, body) {

        })
        response.redirect('/house');
    });
});


router.get('/home/:casa', global.secure(), function (request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = request.user.email;
    var casa1 = request.params.casa;


    var finalGraph = [];
    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
        req.get('http://localhost:8080/house/' + casa1, function (error, resp, body) {
            jsonData2 = JSON.parse(body2);
            jsonCasa = JSON.parse(body);
            console.log(jsonCasa.name);
            var nTotal = 0;
            var Ncasa = jsonCasa.name;
            var totalSensores = 0;
            var totalDivi = 0;

            var options = {
                uri: 'http://localhost:8080/Entradas',
                method: 'POST',
                json: {

                    "id_house": casa1

                }
            };
            console.log(casa1);

            console.log(options.json);



            jsonData2 = JSON.parse(body2);
            for (var v of jsonData2) {
                if (v.id_house == casa1) {
                    totalDivi = totalDivi + 1;
                    console.log(v.sensor_id)
                    if (v.sensor_id == 0) {


                    } else {
                        totalSensores = totalSensores + 1
                    }

                }

            }
            var inicial = new Date();
            var final = new Date();
            final.setDate(final.getDate() + 1);
            inicial.setDate(inicial.getDate() - 1);

            console.log(inicial);
            console.log(final);
            var id_sensor = 1883957;
            var i = 0;
            var sensor_formatted = id_sensor.toString();
            var posty = {
                uri: 'http://localhost:8080/avgHouse',
                method: 'POST',
                json: {
                    "dataI": inicial,
                    "dataF": final,
                    "email": id
                }
            };



            console.log("ree 1")

            var avgTemp;
            var avgHum;
            var finalVar;
            req(posty, function (error, resp, autismo) {
                console.log('reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee: ' + autismo.temp)


                if (autismo.temp === null || autismo.hum === null) {
                    avgHum = 0;
                    avgTemp = 0;
                } else {
                    avgHum = autismo.hum.substring(0, 4);
                    avgTemp = autismo.temp.substring(0, 4);
                }





                var graph = [];
                console.log('reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee: ' + autismo.hum)

                req(options, function (error, resp, entradas) {
                    var finalVar;
                    var a = entradas;
                    var i = 0;
                    for (var t = 0; t < entradas.reg_date.length; t++) {
                        finalVar = entradas.reg_date[t];

                        graph.push({
                            'account': entradas.username[i],
                            'data': finalVar
                        });

                        i++;
                    }












                    response.set("Content-Type", "text/html");
                    response.render('./index', {
                        id: id,
                        casa1: casa1,
                        jsonData2: jsonData2,
                        nTotal,
                        Ncasa,
                        totalSensores: totalSensores,
                        graph: graph,
                        totalDivi: totalDivi,
                        avgTemp: avgTemp,
                        avgHum: avgHum
                    });

                });
            });
        });

    });

});


router.post('home/:casa', function (request, response, body) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var casa1 = request.params.casa;
    var options = {
        uri: 'http://localhost:8080/Entradas',
        method: 'POST',
        json: {
            "id_house": casa1

        }
    };

    console.log(options.json);

    req(options, function (error, resp, body) {
        var parsed = JSON.parse(body);
        console.log(parsed);








    });
});



router.get('/registo', function (request, response) {
    //console.log(request.isAuthenticated());

    response.set("Content-Type", "text/html");
    response.render('./registo', {
        error: ""
    });

});

router.post('/registo', function (request, response) {
    var errors = request.validationErrors();

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var options = {
        uri: 'http://localhost:8080/utilizador',
        method: 'POST',
        json: {
            "username": request.body.username,
            "password": request.body.password,
            "email": request.body.email,
            "type": "user"
        }
    };

    req(options, function (error, resp, body) {
        if (resp.statusCode == 201) {
            response.redirect('/login');
        } else if (resp.statusCode == 200) {
            response.set("Content-Type", "text/html");
            response.render('./registo', {
                error: "email"
            });
        } else {

        }
    });

});




router.post('/house/:casa/delete', function (request, response) {

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id_casa = request.params.casa;
    console.log("tentativa inicial")

    var options = {
        uri: 'http://localhost:8080/house/delete/' + id_casa,
        method: 'POST',
        json: {


        }

    };
    req(options, function (error, resp, body) {

    })
    console.log("tentativa final")
    response.redirect('/house')

});


router.post('/login', function (request, response) {


    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var options = {
        uri: 'http://localhost:8080/login',
        method: 'POST',
        json: {
            "email": request.body.email,
            "password": request.body.password
        }
    };

    var email = request.body.email;
    console.log(email);
    req(options, function (error, resp, body) {
        if (resp.statusCode == 200) {
            request.login(email, function (err) {


                console.log(request.session.returnTo);
                if (request.session.returnTo) {
                    response.redirect(request.session.returnTo || '/login');
                    delete request.session.returnTo;


                } else {

                    response.redirect('/house');
                }
            });
        } else if (resp.statusCode == 401) {
            var error = "password";
            response.set("Content-Type", "text/html");
            response.render('./login', {
                error: "password"
            });
        } else {
            var error = "email";
            response.set("Content-Type", "text/html");
            response.render('./login', {
                error: "email"
            });
        }

    });

});
router.get('/log/:casa', global.secure(), function (request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = request.user.email;
    var casa1 = request.params.casa;


    var finalGraph = [];
    req.get('http://localhost:8080/view/' + id, function (error, resp, body2) {
        req.get('http://localhost:8080/log/' + casa1, function (error, resp, body) {
            jsonData2 = JSON.parse(body2);
            jsonCasa = JSON.parse(body);
            console.log(jsonCasa.name);
            var nTotal = 0;
            var Ncasa = jsonCasa.name;
            var totalSensores = 0;
            var totalDivi = 0;

            var options = {
                uri: 'http://localhost:8080/Entradas',
                method: 'POST',
                json: {

                    "id_house": casa1

                }
            };
            console.log(casa1);

            console.log(options.json);



            jsonData2 = JSON.parse(body2);
            for (var v of jsonData2) {
                if (v.id_house == casa1) {
                    totalDivi = totalDivi + 1;
                    console.log(v.sensor_id)
                    if (v.sensor_id == 0) {


                    } else {
                        totalSensores = totalSensores + 1
                    }

                }

            }

            var graph = [];
            req(options, function (error, resp, entradas) {
                var finalVar;
                var a = entradas;
                var i = 0;
                for (var t = 0; t < entradas.reg_date.length; t++) {
                    finalVar = entradas.reg_date[t];

                    graph.push({
                        'account': entradas.username[i],
                        'data': finalVar
                    });

                    i++;
                }

                response.set("Content-Type", "text/html");
                response.render('./log', {
                    id: id,
                    casa1: casa1,
                    jsonData2: jsonData2,
                    nTotal,
                    Ncasa,
                    totalSensores: totalSensores,
                    graph: graph,
                    totalDivi: totalDivi
                });

            });
        });

    });
});

module.exports = router;