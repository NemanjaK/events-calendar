var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var namespace = require('express-namespace');

var LANG_COOKIE = 'cshdLang';

var app = express();

var config = require('./config.json');

if (config.port) {
    process.env.PORT = config.port;
    console.log("SERVER_PORT: " + process.env.PORT);
} else {
    console.log("SERVER_PORT NOT SPECIFIED. DEFAULT PORT 3000.");
    process.env.PORT = 3000;
}


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(function noCache(req, res, next){
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires",0);
    next();
});
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
// set a cookie
app.use(function (req, res, next) {
    // check if client sent cookie

    var header = req.headers["accept-language"];
    var lang = req.cookies[LANG_COOKIE];

    // set default language
    if(lang === undefined){
        if(header){
            var currentLanguage = header.substring(0,2);
            res.cookie(LANG_COOKIE, currentLanguage, { maxAge: 315360000, httpOnly: false });
        } else {
            res.cookie(LANG_COOKIE, 'en', { maxAge: 315360000, httpOnly: false });
        }
    }
    next();
});
//Load passport auth
require("./routes/passportRoutes")(app);

// Load service routes
require("./routes/serviceRoutes")(app);

app.use(app.router);

require("./routes/routes")(app);

app.use(function(err, req, res, next) {
    if(!err) {
        return next();
    }
    console.log("!!!GLOBAL ERROR!!!", err);
    res.json(500, {
        error: (new Date).toUTCString() + '500 global error ...',
        data: err
    });
});

// / catch 404
app.use(function (req, res, next) {
    res.json(404, {
        error: '404 not found ...'
    });
});


module.exports = app;

process.on('uncaughtException', function (err) {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
});
