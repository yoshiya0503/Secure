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
   
    if (CheckLength(user_info.password, 1) || CheckLength(user_info.mail, 1)) {
        user_info = {name : '', mail : '', password : ''};
    }
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
    console.log(form_info);
    console.log(CheckLength(form_info.mail, 1));

    if (CheckLength(form_info.password, 1) || CheckLength(form_info.mail, 1)) {
        req.flash('error', '全角文字を入れないでください');
        console.log("是なっ区");
        return res.redirect('/login.html');
    }
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
    if (req.session.user) {
        return res.redirect('/home.html');
    }
    var message = req.flash(); 
    req.session.destroy();
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

    if (CheckLength(req.body.user.password, 1) || CheckLength(req.body.user.mail, 1)) {
        req.flash('error', '名前以外全角文字を入れないでください');
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
    
    if (req.session.user) {
        return res.redirect('/home.html');
    }
    
    var name = req.session.regist_user && req.session.regist_user.name;
    var mail = req.session.regist_user && req.session.regist_user.mail;
    var password = req.session.regist_user && req.session.regist_user.password;
    if (!name || !mail || !password) {
        return res.redirect('/register.html');
    }
    var user_info = req.session.regist_user;
    return res.render('confirm',{user : user_info});
};

exports.confirm = function (req, res) {
    authService.register(req.session.regist_user, function (result) {
        delete req.session.regist_user;
        res.redirect('/login.html');
    });
};

/****************************************************************
 * * 全角/半角文字判定
 * *
 * * 引数 ： str チェックする文字列
 * * flg 0:半角文字、1:全角文字
 * * 戻り値： true:含まれている、false:含まれていない 
 * *
 * ****************************************************************/
var CheckLength = function(str,flg) {
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
        // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
        if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            if(!flg) return true;
        } else {
            if(flg) return true;
        }
    }
    return false;
}
