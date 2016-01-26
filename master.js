#!/usr/bin/env node

startup = function(){

// set up ======================================================================
// get all the tools we need
var config = require("./config.js")
var express  = require('express');
var app      = express();
var port     = config.port;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require("path")

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static(__dirname, '/public'));

// required for passport
app.use(session({ secret: 'wow4ever' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//============================================================================================================================================

var server = app.listen(port);

var io = require('socket.io').listen(server);

var userCount = 0;
var hasleft = "A user has left the Chat!"
var hasjoined = "A user has joined the Chat!"
	
	io.sockets.on('connection', function(socket) {
		userCount++;
		io.sockets.emit('hasjoined', { hasjoined: hasjoined})
  		io.sockets.emit('userCount', { userCount: userCount });
  	
  	socket.on('disconnect', function() {
    	userCount--;
    	io.sockets.emit('hasleft', { hasleft: hasleft})
    	io.sockets.emit('userCount', { userCount: userCount });
  	});

    socket.on('message_to_server', function(data) {
        io.sockets.emit("message_to_client",{ message: data["message"] });
    	});
	});
//============================================================================================================================================
}

module.exports.startup = startup
