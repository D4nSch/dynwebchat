#!/usr/bin/env node

var config = require("./config/config.js")

console.log("\n\033[1;32mDynWeb-Project\033[0m: Chat")

var theapp = require('./master.js')
theapp.startup()

console.log("\033[1;32mversion\033[0m: "+config.version+".")
console.log("\033[1;32mwritten by\033[0m: " + config.author +".\n\033[1;32mconnecting on\033[0m "+config.server+":"+config.port+".\n")
