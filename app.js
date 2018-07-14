var express = require('express');
var app = express();
var router = express.Router();

app.use(express.static('app'));
app.get('/', function(req, res) {
    res.sendfile('./app/views/index.html');
});

module.exports = app;