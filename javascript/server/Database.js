const winston = require('winston');
const sqlite3 = require('sqlite3').verbose();
const Promise = require('promise');

function logError(error) {
    error && winston.error('DB: Error:' + error);
}

function toDBParamters(object) {
    var returnValue = {};
    Object.keys(object).forEach(function(key) { returnValue['$' + key] = object[key]; } );
    console.log(returnValue);
    return returnValue;
}

function Database(config) {
    const db = new sqlite3.Database(__dirname + config.file, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    // create table and indices
    db.serialize(function() {
        db.run(config.createTable.join(''), logError);
        config.createIndex.forEach(function(index) { db.run(index, logError) });
    });

    this.insert = function(parkingSpace) {
        return new Promise(function (resolve, reject) {
            db.run(
                config.insert.join(''),
                toDBParamters(parkingSpace),
                function(error) {
                    logError(error);
                    if(error) {
                        reject();
                    } else {
                        resolve();
                    }
                }
            );
        });


    }



}

module.exports = Database;

