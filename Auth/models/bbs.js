/**
 * Created by hiroism007 on 10/30/13.
 */
var connection = require('./mysql/connect.js').connection;
var key = require('../config/config.json').secret_key;
var crypto = require('crypto');

/**
 * post_table schema
 * id int(11) uniq auto_increment primary
 * user_id int(11)
 * body varchar
 */

function BbsService(){}

module.exports = new BbsService();

//TODO ただのセレクト文の場合に第二引数をどうすればいいかわからないので一旦放置
/**
 * bbsの一覧表示の際に投稿されているポストを取得する処理
 * @param callback {Function}
 */
BbsService.prototype.getPosts = function(callback) {
    connection.query('SELECT  name, body FROM post JOIN user ON user.id = post.user_id', function (err, result) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        console.log(result);
        console.log("get BBS");
        return callback(null, result);
    });
};

/**
 * bbsに投稿する処理
 * session から　userIDを取得する
 * @param post {Object} 投稿されるオブジェクト
 */
BbsService.prototype.postData = function(post){
    connection.query('INSERT INTO post set ?', {user_id : post.user.id, body: post.body},function (err, result) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, result);
    });
};
