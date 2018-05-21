const port = 8000;
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




//This function will allow us to retrict the access to the routes
global.secure = function (type) {
	return function (request, response, next) {
		if (request.isAuthenticated()) {
			if (type) {
				if (type === request.user.type) {
					return next();
				} else {
					response.redirect('/');
				}
			} else {
				return next();
			}
		}
		response.redirect('/');
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

passport.serializeUser(function (email, callback) {
	callback(null, email);
});

passport.deserializeUser(function (email, callback) {
	userModel.read(email, function (data) {
		callback(null, data);
	});
});
//end of new

app.set('view engine', 'ejs');
app.set('views', 'views');

global.connection = mysql.createConnection({
	host: 'darkredman-casa.dyndns.org',
	user: 'dai',
	password: 'mypass',
	database: 'dwpt_dai'
}).on('enqueue', function (sequence) {
	if ('Query' === sequence.constructor.name) {
		console.log(sequence.sql);
	}
});

app.listen(port, function () {




	console.log('Server started at: ' + port);

});

//Midleware that sets the isAuthenticated variable in all views

app.use(function(request, response, next){
	response.locals.user = request.user;
	response.locals.isAuthenticated = request.isAuthenticated();
	next();
});





server.listen(5000);


app.use('/', require('./controllers/index.route'));
app.use('/public', express.static('public'));
app.use('/profile', require('./controllers/profile.route'));
app.use('/room', require('./controllers/divisao.route'));
app.use('/admin', require('./controllers/admin.route'));
app.use('/logout', require('./controllers/logout.route'));
app.use('/card', require('./controllers/card.route'));

//new
