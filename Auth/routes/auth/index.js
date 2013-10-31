/**
 * @title auth_controller
 * @author Yoshiya ito <ito_yoshiya@cyberagent.co.jp>
 * @version 2.0
 */

/**
 * TODO
 * DBにユーザー情報を保存し、モデルから情報を得る
 * 使用に変更したい
 * 新規ユーザー登録のためのregistrationミドルウェア
 * も設計したい
 */
var authService = require('../../models/auth.js');

/**
 * ログイン画面を表示する関数
 * 既にログインしていた場合
 * 即座にhome画面へリダイレクトする
 * @param {Object} req
 * @param {Object} res
 */
exports.getLoginform = function (req, res) {
    
    var user_info = req.session.form_info || {name : '', mail : '', password : ''};
    var message = req.flash();
   
    authService.validateLogin(user_info, function (valid) {
        if (valid) {
            return res.redirect('/home.html');
        }
        return res.render('auth', {user : user_info, message : message});
    });
};

/**
 * ログイン処理
 * ログイン情報がおかしい場合 loginへリダイレクト
 * ログイン情報が正しい場合 login_resultへリダイレクト
 * @param {Object} req
 * @param {Object} res
 */
exports.login = function (req, res) {
     
    //セッションにユーザーの情報を保存する
    var form_info = req.body.user;
    req.session.form_info = form_info;

    console.log(req.session.form_info);
    if (!form_info.mail && !form_info.password) {
        req.flash('error', 'メールアドレスを入力してください');
        req.flash('error', 'パスワードを入力してください');
        return res.redirect('/login.html');
    }
    if (!form_info.mail) {
        req.flash('error', 'メールアドレスを入力してください');
        return res.redirect('/login.html');
    }
    if (!form_info.password) {
        req.flash('error', 'パスワードを入力してください');
        return res.redirect('/login.html');
    }
    authService.validateLogin(form_info, function (result) {
        if (!result) {
            req.flash('error', 'ログイン情報が不正デス');
            return res.redirect('/login.html');
        }
        delete req.form_info;
        req.session.user = result;
        return res.redirect('/home.html');
    });
};

/**
 * ログアウトする関数
 * ログアウトするとログイン画面へリダイレクト
 * @param {Object} req
 * @param {Object} res
 */
exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/');
};

/**
 * 登録画面の取得
 * @param {Object} req
 * @param {Object} res
 */
exports.getRegisterform = function (req, res) {
    var message = req.flash(); 
    return res.render('regist', {message : message}); 
};

/**
 * 登録処理
 * @param {Object} req
 * @param {Object} res
 */
exports.regist = function (req, res) {
    //内容がないようの時は注意する
    if (!req.body.user.mail || !req.body.user.name || !req.body.user.password) {
        req.flash('error', 'フォームを全部うめめてください');
        return res.redirect('/register.html');
    }
    authService.validateRegist(req.body.user, function (result) {
        if (result.length !== 0) {
            req.flash('error', 'そのメールアドレスは重複しています');
            return res.redirect('/register.html');
        }
        req.session.regist_user = req.body.user;
        return res.redirect('/confirm.html');
    });
};

exports.getConfirmform = function (req, res) {
    var user_info = req.session.regist_user || {name : '', mail : '', password : ''};
    res.render('confirm',{user : user_info});
};

exports.confirm = function (req, res) {
    /**
     * TODO yes or noで処理を分ける
     *
     */

    //noの場合
    //req.session.destroy;
    //res.redirect('register.html');

    //yesの場合
    authService.register(req.session.regist_user, function (result) {
        /**
         *TODO bbsへ飛ばす
         *
         */
        req.session.destroy();
        res.redirect('/login.html');
    });
};

