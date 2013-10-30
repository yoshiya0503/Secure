/**
 * Created by hiroism007 on 10/30/13.
 */
var connection = require('./mysql/connect.js').connection;
var key = require('../config/config.json').secret_key;
var crypto = require('crypto');

function BbsService(){}

module.exports = new BbsService();


//TODO ただのセレクト文の場合に第二引数をどうすればいいかわからないので一旦放置
BbsService.prototype.getPosts = function(callback) {
    connection.query('SELECT  name, body FROM post', ,function (err, result) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, [].concat(result));
    });
};

BbsService.prototype.postData = function(post){
    connection.query('INSERT INTO post set ?', {user_id : post.user.id, name : post.user.name, body: post.body},function (err, result) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, result);
    });
};