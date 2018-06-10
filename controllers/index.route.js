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



router.get('/', function(request, response) {

    response.set("Content-Type", "text/html");
    response.render('./frontpage', {});

});

// ROTA DA FRONT PAGE
router.get('/login', function(request, response) {
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
    });

    response.set("Content-Type", "text/html");
    response.render('./login', {
        error: ""
    });


});







router.post('/add/add/:id_sensor', global.secure(), function(request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    var options = {
        uri: 'http://localhost:8080/division'+ request.body.division,
        method: 'POST',
        json: {
            "id_sensor": request.params.id_sensor,
            "id_house": request.body.house,
            "id_division": request.body.division
        }
    };

    req.post('http://localhost:8080/view2/' + id_user, function(error, resp, body) {



        response.redirect('./house', {
                    });

    });

});
















router.get('/add/:id_sensor', global.secure(), function(request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id_user = request.user.email;
    var id_sensor = request.params.id_sensor;
    console.log(id_user);

    console.log(id_sensor);




    var graph = [];

    req.get('http://localhost:8080/view2/' + id_user, function(error, resp, body) {


        parsed = JSON.parse(body);
        var id_house = parsed.id_house;

        var id_division = parsed.id_division;

        var house = parsed.house;

        var division = parsed.division;

        response.set("Content-Type", "text/html");

        response.render('./adicionar_sensor', {
            house: house,

            id_house: id_house,
            division: division,
            id_division: division,
            id_sensor: id_sensor,

            casa1: "Nova Casa",
            id: id_user,
            Ncasa: "Nova Casa"
        });

    });

});























// ROTA DA PAGINA DAS CASAS DO UTILIZADOR
router.get('/house', global.secure(), function(request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var id = request.user.email;
    var account = request.user.account;

    req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {
        req.get('http://localhost:8080/house/', function(error, resp, body) {
            jsonData2 = JSON.parse(body2);
            jsonCasa = JSON.parse(body);

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
                jsonData2: jsonData2,
                jsonCasa: jsonCasa,
                account: account
            });
        });
    });

});



router.get('/house/create', global.secure(), function(request, response, body) {
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
            isNew: true,

            casa: casa
        });
    });

});


router.post('/house/create', function(request, response, body) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var errors = request.validationErrors();
    var id = request.user.account;
    var path;
    var teste;
    console.log(request.files)
    if (request.files.sampleFile !== teste) {


        let sampleFile = request.files.sampleFile;
        console.log("Fase1")
        sampleFile.mv('./public/assets/img/casas/' + request.user.account + "-" + request.body.name + '.jpg', function(err) {
            if (err)
                return response.status(500).send(err);
            console.log("Fase2")

        });
        Jimp.read('./public/assets/img/casas/' + request.user.account + "-" + request.body.name + '.jpg', function(err, lenna) {
            if (err) throw err;
            lenna.resize(480, 320) // resize
                .quality(100) // set JPEG quality
                // set greyscale
                .write('./public/assets/img/casas/' + request.user.account + "-" + request.body.name + '.jpg'); // save
            console.log("imagem resized")
        });
        path = 1;
    } else {
        path = 0;
    }
    var options = {
        uri: 'http://localhost:8080/house',
        method: 'POST',
        json: {
            "name": request.body.name,
            "account_id": id,
            "path": path
        }
    }
    console.log("Fase1")
    console.log(request.body.name)
    console.log(id)
    console.log(path)

    req(options, function(error, resp, body) {

    })
    response.redirect('/house');
});


router.get('/house/edit/:casa', function(request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = request.user.email;
    var casa1 = request.params.casa;

    req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {
        req.get('http://localhost:8080/house/', function(error, resp, body) {
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


router.post('/house/edit/:casa', function(request, response, body) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var errors = request.validationErrors();
    var id = request.user.account;
    var casa1 = request.params.casa;
    req.get('http://localhost:8080/house/', function(error, resp, body) {
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






        Jimp.read('./public/assets/img/casas/' + account + "-" + nome + '.jpg', function(err, lenna) {
            if (err) throw err;
            lenna.resize(480, 320) // resize
                .quality(100) // set JPEG quality
                // set greyscale
                .write('./public/assets/img/casas/' + account + "-" + request.body.name + '.jpg'); // save
            console.log("imagem resized")
        });

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

        req(options, function(error, resp, body) {

        })
        response.redirect('/house');
    });
});


router.get('/home/:casa', function(request, response, body) {
    //console.log(request.isAuthenticated());
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = request.user.email;
    var casa1 = request.params.casa;


    req.get('http://localhost:8080/view/' + id, function(error, resp, body2) {
        req.get('http://localhost:8080/house/' + casa1, function(error, resp, body) {
            jsonData2 = JSON.parse(body2);
            jsonCasa = JSON.parse(body);
            console.log(jsonCasa.name);
            var nTotal = 0;
            var Ncasa = jsonCasa.name;

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

});


router.post('home/:casa', global.secure(), function(request, response, body) {
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
        document.getElementById('avg').innerHTML = body;
    });
});


router.get('/registo', function(request, response) {
    //console.log(request.isAuthenticated());

    response.set("Content-Type", "text/html");
    response.render('./registo', {
        error: ""
    });

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
        if (resp.statusCode == 201) {
            response.redirect('/login');
        } else if (resp.statusCode == 200) {
            response.set("Content-Type", "text/html");
            response.render('./registo', {
                error: "email"
            });
        }else {
            
        }
    });

});

router.post('/login', function(request, response) {


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
        if (resp.statusCode == 200) {
            request.login(body.email, function(err) {

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

module.exports = router;
