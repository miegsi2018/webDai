const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
const swal = require('sweetalert2');
const mqtt = require('mqtt');
const req = require('request');
var userData;
var Jimp = require("jimp");

var casa = [];



// ROTA DA FRONT PAGE
router.get('/', function(request, response) {
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

    req(options, function(error, resp, body) {
        console.log(body);
        var a = body;
        for (var t = 0; t < body.temp.length; t++) {
            console.log('fds');
            console.log(body.data[i]);
            i++;
            graph.push({
                'data': body.data[i],
                'temperature': body.temp[t]
            });

            console.log(graph);
        }
    })

    response.set("Content-Type", "text/html");
    response.render('./login', {

    });


});

// ROTA DA PAGINA DAS CASAS DO UTILIZADOR
router.get('/house', function(request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = request.user.email;
    
    req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {
        jsonData2 = JSON.parse(body2);

        var casa = [];
        var casaN = [];
        if (jsonData2.length >= 1) {
            casa.push(jsonData2[0].id_house);

            casaN.push(jsonData2[0].house);
            for (var i = 0; i < jsonData2.length; i++) {

                for (var i = 1; i < jsonData2.length; i++) {
                    console.log("inico" + jsonData2[i - 1].id_house)
                    console.log("fim" + jsonData2[i].id_house)
                    if (jsonData2[i - 1].id_house != jsonData2[i].id_house) {
                        if (casa != jsonData2[i].id_house) {
                            casa.push(jsonData2[i].id_house);
                            casaN.push(jsonData2[i].house);

                        }

                    }
                }
            }
        } else {

        }






        response.set("Content-Type", "text/html");
        response.render('./house', {
            id: id,
            casa: casa,
            casaN: casaN,
            jsonData2: jsonData2
        });
    });

});



router.get('/house/create', function(request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = request.user.email;

    req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {

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
            casa: casa
        });
    });

});


router.post('/house/create', function(request, response, body) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var id = request.user.account;

    var options = {
        uri: 'http://localhost:8080/house',
        method: 'POST',
        json: {
            "name": request.body.name,
            "account_id": id
        }
    }

    req(options, function(error, resp, body) {

    })
    response.redirect('/house');
});


router.get('/home/:casa', function(request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = request.user.email;
    var casa1 = request.params.casa;


    req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {

        var nTotal = 0;
        var Ncasa;
        for (var e of jsonData2) {
            if (casa1 == e.id_house) {

                Ncasa = e.house;

                nTotal = nTotal + 1;


            }
        }
        jsonData2 = JSON.parse(body2)
        console.log(jsonData2);

        response.set("Content-Type", "text/html");
        response.render('./index', {
            id: id,
            casa1: casa1,
            jsonData2: jsonData2,
            nTotal,
            Ncasa
        });

    });

});


router.post('home/:casa', function(request, response, body) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var options = {
        uri: 'http://localhost:8080/avgTemp',
        method: 'POST',
        json: {
            "dataI": request.body.dataI,
            "dataF": request.body.dataF
        }
    };

    console.log(options.json);

    req(options, function(error, resp, body) {
        console.log(body);
        document.getElementById('avg').innerHTML = body
    })
});


router.get('/registo', function(request, response) {
    //console.log(request.isAuthenticated());

    response.set("Content-Type", "text/html");
    response.render('./registo', {});

});

router.post('/registo', function(request, response) {
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

    req(options, function(error, resp, body) {

    });
    response.redirect('/');
});

router.post('/', function(request, response) {

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


    req(options, function(error, resp, body) {
        if (body.password == request.body.password) {
            request.login(body.email, function(err) {
                response.redirect('/house');
            });
        } else {
            response.json({
                error: "Updated Successfully",
                status: 400
            });
        }
    });
});

module.exports = router;
