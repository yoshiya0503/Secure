var connection = require('./mysql/connect.js').connection;
var key = require('../config/config.json').secret_key;
var crypto = require('crypto');

exports.register = function (user, callback) {

    var cipher = crypto.createCipher('aes192', key);
    cipher.update(user.password);
    var cipheredText = cipher.final('hex');

    connection.query('INSERT INTO user set ?', {mail : user.mail, name : user.name, password : cipheredText},function (err, result) {
        if (err) {
            console.log(err);
        }
        return callback(result);
    });   
};

exports.validateRegist = function(user, callback) {
    connection.query('SELECT * FROM user WHERE mail = ?', [user.mail], function (err, result) {
        if (err) {
            console.log(err);
        }
        return callback(result);
    });
};

exports.validateLogin = function (user, callback) {

    /**
     *TODO パラメータチェック
     */
    user.mail = user.name;
    connection.query('select * from user where mail = ?', [user.mail], function (err, result) {
        if (err) {
            console.log(err);
        }

        if (result.length === 0) {
            return callback(false);
        }
        
        var decipher = crypto.createDecipher('aes192', key);
        decipher.update(result[0].password,'hex', 'utf8');
        var decipheredText = decipher.final('utf8');
        console.log(decipheredText);
        var valid = (user.name === result[0].name && user.password === decipheredText) ? true : false;
        return callback(valid);
    });
};
