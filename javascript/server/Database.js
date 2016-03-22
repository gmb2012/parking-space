const winston = require('winston');
const sqlite3 = require('sqlite3').verbose();

function logError(error) {
    error && winston.error('DB: Error:' + error);
}

function Database(config) {
    const db = new sqlite3.Database(__dirname + config.file, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    // create table and indices
    db.run(config.createTable.join(''), logError);
    config.createIndex.forEach(function(index) { db.run(index, logError) });




}

module.exports = Database;

