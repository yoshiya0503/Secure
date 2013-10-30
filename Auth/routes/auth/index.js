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
var user = {
    name : 'admin',
    password : '0906'
};

/**
 * ログイン画面を表示する関数
 * 既にログインしていた場合
 * 即座にhome画面へリダイレクトする
 * @param {Object} req
 * @param {Object} res
 */
exports.getLoginform = function (req, res) {
    
    var user_info = req.session.user || {name : '', password : '', type : ''};
    var message = req.flash();
   
    if (user_info.type === 'guest' && user_info.name) {
        return res.redirect('/login_result.html');
    }

    validate(user_info, function (valid) {
        if (valid) {
            return res.redirect('/login_result.html');
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
    var user_info = req.body.user;
    req.session.user = user_info;
    
    if (!user_info.type) {
        req.flash('error', '管理者かゲストが入力してください');
        return res.redirect('/login.html');
    }

    //管理かゲストかで処理内容が異なる
    if (user_info.type === 'guest') {
        if (!user_info.name) {
            req.flash('error', '名前を入力してください');
            return res.redirect('/login.html');
        }
        return res.redirect('/login_result.html');
    } else if (user_info.type === 'admin') {
        if (!user_info.name && !user_info.password) {
            req.flash('error', '名前を入力してください');
            req.flash('error', 'パスワードを入力してください');
            return res.redirect('/login.html');
        }
        if (!user_info.name) {
            req.flash('error', '名前を入力してください');
            return res.redirect('/login.html');
        }
        if (!user_info.password) {
            req.flash('error', 'パスワードを入力してください');
            return res.redirect('/login.html');
        }
        if (user_info.name !== user.name || user_info.password !== user.password) {
            req.flash('error', 'ログイン情報が不正です');
            return res.redirect('/login.html'); 
        }
        return res.redirect('/login_result.html');
    }
};

/**
 * ホーム画面へレンダリングする関数
 * セッションがなければログイン画面へリダイレクト
 * @param {Object} req
 * @param {Object} res
 */
exports.getHome = function (req, res) {
    if (req.session.user) {
        var user_info = req.session.user || {name : '', password : ''};
        res.render('home', {user :user_info});
    } else {
        res.redirect('/login.html');
    }
};

/**
 * ログアウトする関数
 * ログアウトするとログイン画面へリダイレクト
 * @param {Object} req
 * @param {Object} res
 */
exports.logout = function (req, res) {
    delete req.session.user;
    res.redirect('/');
};

/**
 * ユーザーデータを判別する関数
 * DBとのI/Oに備える
 * @param {Object} user_info name/password/type
 * @param {Function} callback
 *
 */
var validate = function (user_info, callback) {
    var valid = (user_info.name === user.name && user_info.password === user.password) ? true : false;
    callback(valid);
};
