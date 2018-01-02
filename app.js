
// Dependencies.
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var fs = require('fs');
var request = require('request');
var app = express();
var http = require('http').Server(app);

// Specifie body parsers
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.raw({ limit: '50mb', type: '*/*' }));

// Return all static files such as css and js in public folder.
app.use(express.static(path.join(__dirname, 'dist/public')));

/* Routing  */
// For root, return the emulator
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

//#region Behave as LINE Platform
const lineAPIUrl = "https://api.line.me/v2/bot";

app.delete('/*', function (req, res) {
    handleRequest(req, res);
});

app.post('/*', function (req, res) {
    if (req.body != null) {
        if (req.headers['content-type'] === 'application/json') {
            req.body = JSON.stringify(req.body);
        }
        else if (req.method === "POST" && req.url.indexOf('content') > -1) {
            req.body = Buffer.from(req.body.toString().split(',')[1], 'base64');
        }
        else if (req.headers['content-length'] === "0") {
            req.body = null;
        }
    }
    handleRequest(req, res);
});
// Receive request from your bot application.
app.get('/*', function (req, res) {
    handleRequest(req, res);
});

// Handle all request by add LINE Platform Url.
function handleRequest(req, res) {

    let headers = {};
    headers.authorization = req.headers.authorization;
    headers['content-type'] = req.headers['content-type'];

    let requestSettings = {
        headers: headers,
        uri: `${lineAPIUrl}${req.url}`,
        method: req.method
    };

    if (req.method === "POST") {
        requestSettings.body = req.body;
    }
    else if (req.method === "GET" && req.url.indexOf('content') > -1) {
        requestSettings.encoding = null;
    }

    request(requestSettings, function (error, response, body) {
        res.send(body);
    });
}

//#endregion
/* Start the service */
http.listen(3000, function () {
    console.log('listening on *:3000');
});