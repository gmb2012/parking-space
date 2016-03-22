const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const winston = require('winston');
const Config = require('./config.json');
const Database = require('./Database');

// enable compression & json parsing
app.use(compression());
app.use(bodyParser.json());

// static routes
app.use(express.static('public'));

// webservice endpoints

// connect to database & create table if not exists => own class
const dbInstance = new Database(Config.database);
var bla = dbInstance.insert(
    {
        uuid: "12",
        available: 25,
        number: 3,
        owner: "4",
        booker: "5",
        booked: 6,
        created: 7,
        updated: 8
    }
);

bla.then(function() {console.log('gut')}, function(){console.log('mäh')});

app.listen(3000);
winston.info('Webserver is running on port 3000');
