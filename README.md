# DynWebProject - WebChat
# Authors: Daniel Schaberreiter / Bernhard Kober

# General

Simple chat application, which transmits messages from one client to all others. The only special node.js module used is socket.io, it allows us to create a socket connection between the server and clients and call events and send data back and forth (npm install socket.io). At the moment the application is kept very simple and easy to understand.

# GitHub

* in the project-folder:
* sudo git add *
* sudo git commit -m "msg"
* sudo git push -u origin master

# Problems

//TODO

# Goals / who is going to use this app?

//TODO

# Files

`-- dynweb_project_chat
	|
	server.js
	config.js
	README.md
	|
    |-- controller
    |   	`-- master.js
    |   	`-- static.js
    |   	`-- style_css.js
    |
    |-- helper
    |   	`-- urlparser.js
    |
    |-- node_modules
    |   	`-- socket.io
    |			`-- ...
    |
    |-- public      
    |		`-- index.html
    |		`-- style.css
