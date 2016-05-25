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
    var statementAndParams = deleteBuilder(select, filter);
    var orderBy = orderByBuilder(order);

    if(orderBy.length > 0) {
        statementAndParams.statement += ' ORDER BY ' + orderBy;
    }

    return statementAndParams;
}

function deleteBuilder(deleteStmt, filter) {
    var where = whereBuilder(filter);

    if(where.statement.length > 0) {
        deleteStmt += ' WHERE ' + where.statement.join(' AND ');
    }

    return {
        statement: deleteStmt,
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

    queryDB = function(statement, parameter) {
        return new Promise(function (resolve, reject) {
            db.all(statement, parameter,
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
    };

    this.select = function(filter, order) {
        var select = selectBuilder(config.select, filter, order);
        return queryDB(select.statement, select.parameter);
    }

    this.insert = function(parkingSpace) {
        return queryDB(config.insert.join(''), toDBParamters(parkingSpace));
    }


    this.update = function(parkingSpace) {
        return queryDB(config.update.join(''), toDBParamters(parkingSpace));
    }

    this.delete = function(filter) {
        var deleteStmtAndParams = deleteBuilder(config.delete, filter);
        return queryDB(deleteStmtAndParams.statement, deleteStmtAndParams.parameter);
    };
}

module.exports = Database;