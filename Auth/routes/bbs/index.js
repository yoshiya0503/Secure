/**
 * @title bbs_controller
 * @author Hiroyuki Tachibana <hiroism007@gmail.com>
 * @version 1.0
 */

var bbsService = require('../../models/bbs');

/**
 * bbsページにアクセスする、bbsに投稿する前にログインしているかチェックする処理
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.checkLoggedIn = function (req, res, next) {
    if(!req.session.user) {
        req.flash('error', 'ログインしてからアクセスしてください。');
        return res.redirect('/login.html');
    }
    return next();
};

/**
 * bbsページ取得処理
 * @param req
 * @param res
 */
exports.index = function(req, res) {
    bbsService.getPosts(function(err, posts) {
        if(err) {
            //TODO posts取得時のエラー処理
        };
        return res.render('home', { posts : posts});
    });
};

/**
 * bbsへの投稿処理
 * @param req
 * @param res
 * @returns {*}
 */
exports.post = function(req, res) {
    if(!req.body.post) {
        req.flash('error', '本文が記載されていません');
        return res.redirect('/home.html');
    }
    var postData = req.body.post;
    postData.user = req.session.user;
    bbsService.postData(postData, function(err, result) {
       if(err) {
           //TODO post失敗時のエラー処理
       }
       //TODO できたら、リダイレクトして再読み込みではない方がいい
       return res.redirect('/home.html');
    });
};
