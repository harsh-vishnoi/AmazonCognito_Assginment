var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Route = require('./Route');
app.use('/', Route);

module.exports = app;
