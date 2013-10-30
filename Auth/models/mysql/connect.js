var mysql = require('mysql');
var config = require('../../config/config.json').mysql;

exports.connection = mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password
});

