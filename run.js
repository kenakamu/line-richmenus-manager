#!/usr/bin/env node
// Run the simualtor from command prompt.
// This is for npm package.

var shell = require("shelljs");
var os = require('os');
var path = require("path");
var myArgs = require('optimist').argv;
let port = myArgs.port || 3000;

if(os.platform() === "win32"){
    shell.exec(`start http://localhost:${port} && node ${path.join(__dirname, `app.js --port=${port}`)}`);
}
else if(os.platform() === "darwin"){
    shell.exec(`open http://localhost:${port} && node ${path.join(__dirname, `app.js --port=${port}`)}`);
}
else if(os.platform() === "linux"){
    shell.exec(`xdg-open http://localhost:${port} && node ${path.join(__dirname, `app.js --port=${port}`)}`);
}