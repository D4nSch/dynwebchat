startup = function(){

//---------------------------------------------------------------------------------------------------------------
//GENERAL SET UP

//TOOLS WE NEED
var config = require("./config/config.js") //get the general config
var port     = config.port;

var express  = require('express'); //NodeJS framework
var app      = express();

var mongoose = require('mongoose'); //connects us to the db (MongoDB)
var passport = require('passport'); //to handle authentifications
var flash    = require('connect-flash'); //stores messages in the session 
var morgan       = require('morgan'); //logs all requests to the console
var cookieParser = require('cookie-parser'); 
var bodyParser   = require('body-parser');
var session      = require('express-session'); //creates sessions

var configDB = require('./config/database.js'); //get the database config

//---------------------------------------------------------------------------------------------------------------
//DB SET UP
mongoose.connect(configDB.url); // connect to our database

//---------------------------------------------------------------------------------------------------------------
//PASSPORT SET UP
require('./controller/passport.js')(passport); // pass passport for configuration

//---------------------------------------------------------------------------------------------------------------
//SET UP EXPRESS APPLICATION

app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //reads cookies (needed for auth)
app.use(bodyParser.json()); //get information from html forms
app.use(bodyParser.urlencoded({ extended: true })); //parsing html forms

app.set('view engine', 'ejs'); //to use ejs (html/javascript template)

app.use(express.static(__dirname, '/public')); //provide static files (like .css)

//REQUIREMENTS FOR PASSPORT
app.use(session({ secret: 'wow4ever' })); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //flash messages stored in session

//ROUTES
require('./controller/routes.js')(app, passport); //load routes and pass in our app and fully configured passport


var server = app.listen(port);

//---------------------------------------------------------------------------------------------------------------
//SET UP SOCKET.IO

var io = require('socket.io').listen(server);

var userCount = 0;
var hasleft = "A user has left the Chat!"
var hasjoined = "A user has joined the Chat!"
	
	io.sockets.on('connection', function(socket) { //get to know all connections
		  userCount++;
		  io.sockets.emit('hasjoined', { hasjoined: hasjoined}) //send
      io.sockets.emit('userCount', { userCount: userCount }); //send
  	
  	socket.on('disconnect', function() { //get to know all disconnects
    	userCount--;
    	io.sockets.emit('hasleft', { hasleft: hasleft}) 
    	io.sockets.emit('userCount', { userCount: userCount });
  	});

    socket.on('message_to_server', function(data) { //sending messages
      io.sockets.emit("message_to_client",{ message: data["message"] });
    	});
	});
}

module.exports.startup = startup
