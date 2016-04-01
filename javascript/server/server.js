const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const winston = require('winston');
const Config = require('./config.json');
const Database = require('./Database');
const Offer = require('./Offer');

// enable compression & json parsing
app.use(compression());
app.use(bodyParser.json());

// static routes
app.use(express.static('public'));

// connect to database
const dbInstance = new Database(Config.database);

// webservice endpoints
// offer parking space
const offer = new Offer(dbInstance);

app.get('/services/v1/available', function (req, res) {
    offer.getAllAvailable(req, res);
});

app.put('/services/v1/available', function (req, res) {
    offer.addAvailable(req, res);
});

app.get('/services/v1/available/:owner', function (req, res) {
    offer.getAvailableByOwner(req, res);
});

// book parking space

app.listen(3000);
winston.info('Webserver is running on port 3000');
