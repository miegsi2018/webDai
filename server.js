const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const validator = require('express-validator');
const engines = require('consolidate');

var server = require('http').createServer(app);
global.io = require('socket.io')(server);

const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const userModel = require('./models/user.model');

var restServer = 'http://localhost:8080/';
io.origins('*:*') // for latest version



//This function will allow us to retrict the access to the routes
global.secure = function() {
    return function(request, response, next) {
        if (request.isAuthenticated()) {

            return next();

        } else {

            request.session.returnTo = request.originalUrl;
		console.log(request.originalUrl);
            response.redirect('/login');
        }
};
};
//end of 





app.use(validator());
app.use(bodyParser.json(), bodyParser.urlencoded({
    extended: true
}));

//new
app.use(cookieParser());
app.use(session({
    secret: 'someRandomSecretKey',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(username, callback) {
    callback(null, username);

});

passport.deserializeUser(function(username, callback) {
    userModel.read(username, function(data) {
	callback(null, data);
    });
});

app.set('view engine', 'ejs');
app.set('views', 'views');

global.connection = mysql.createConnection({
    host: 'darkredman-casa.dyndns.org',
    user: 'dai',
    password: 'mypass',
    database: 'dwpt_dai'
}).on('enqueue', function(sequence) {
    if ('Query' === sequence.constructor.name) {
        console.log(sequence.sql);
    }
});


//Midleware that sets the isAuthenticated variable in all views

app.use(function(request, response, next) {
    response.locals.user = request.user;
    response.locals.isAuthenticated = request.isAuthenticated();
    next();
});






server.listen(3400);


app.use('/', require('./controllers/index.route'));
app.use('/public', express.static('public'));

app.use('/room', require('./controllers/divisao.route'));

app.use('/logout', require('./controllers/logout.route'));
app.use('/card', require('./controllers/card.route'));
