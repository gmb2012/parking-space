const winston = require('winston');
const sqlite3 = require('sqlite3').verbose();
const Promise = require('promise');

function logError(error) {
    error && winston.error('DB: Error:' + error);
}

function toDBParamters(object) {
    var returnValue = {};
    Object.keys(object).forEach(function(key) { returnValue['$' + key] = object[key]; } );
    return returnValue;
}

function whereBuilder(filter) {
    var returnValue = {
        statement: [],
        parameter: {},
    };

    var whereClause = filter.forEach(function(currentFilter) {
        var statement = currentFilter.field + ' ' + currentFilter.operator;

        if(currentFilter.value) {
            statement += ' $' + currentFilter.field;
            returnValue.parameter['$' + currentFilter.field] = currentFilter.value;
        }

        returnValue.statement.push(statement);
    });

    return returnValue;
}

function orderByBuilder(order) {
    var returnValue = '';

    if(order.field) {
        returnValue = order.field + ' ' + order.direction;
    }

    return returnValue
}

function selectBuilder(select, filter, order) {
    var where = whereBuilder(filter);
    var orderBy = orderByBuilder(order);

    if(where.statement.length > 0) {
        select += ' WHERE ' + where.statement.join(' AND ');
    }

    if(orderBy.length > 0) {
        select += ' ORDER BY ' + orderBy;
    }

    return {
        statement: select,
        parameter: where.parameter
    }
}

function Database(config) {
    const db = new sqlite3.Database(__dirname + config.file, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    // create table and indices
    db.serialize(function() {
        db.run(config.createTable.join(''), logError);
        config.createIndex.forEach(function(index) { db.run(index, logError) });
    });

    this.get = function(filter, order) {
        var select = selectBuilder(config.select, filter, order);
        
        return new Promise(function (resolve, reject) {
            db.all(
                select.statement,
                select.parameter,
                function(error, rows) {
                    if(error) {
                        logError(error);
                        reject();
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

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

