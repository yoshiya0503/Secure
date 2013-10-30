/**
 * @title Login
 * @author Yoshiya ito <ito_yoshiya@cyberagent.co.jp>
 * @version 2.0
 */
var config = require('./config/config.json');
var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.secret_key));
app.use(express.session());
app.use(flash());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

var auth = require('./routes/auth');
app.get('/', auth.getLoginform);
app.get('/login.html', auth.getLoginform);
app.post('/login.html', auth.login);
app.del('/logout.html', auth.logout);
app.get('/login_result.html', auth.getHome);

app.get('/register.html', auth.getRegisterform);
app.post('/register.html', auth.regist);

app.get('/confirm.html', auth.getConfirmform);
app.post('/confirm.html', auth.confirm);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
