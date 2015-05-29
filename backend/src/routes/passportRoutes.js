/**
 * Initializes the passport.js
 */
var FACEBOOK_APP_ID = "768018239925093";
var FACEBOOK_APP_SECRET = "270c43b34634e4369b88ba9812d68b71";
var CALLBACK_CONTEXT = "/auth/facebook/callback";
var CALLBACK_URL = "http://localhost:3000/auth/facebook/callback"; // TODO

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var crypto = require('crypto');


var md5 = require("MD5");

var tables = require("../db/globals").tables;

var secret = 'd6F3Efaa';

var tokens = {};

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc', secret);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher('aes-256-cbc', secret);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');

    return dec;
}

var consumeRememberMeToken = function (token, fn) {
    //var user = tokens[token];
    var salonId = token.substr(0, token.indexOf('-'));
    var userId = token.substr(token.lastIndexOf('-') + 1, token.length);
    var user = {
        user_account_id: userId,
        salon_id : salonId,
        user_account : {
            id: userId
        },
        salon: {
            id: salonId
        }
    };
    // invalidate the single-use token
    //delete tokens[token];
    return fn(null, user);
};

var saveRememberMeToken = function (token, user, fn) {
    tokens[token] = {};
    return fn();
};

var createContext = function (user_account, salon) {
    return {
        user_account: user_account,
        user_account_id: user_account.id,
        salon: salon,
        salon_id: salon.id
    };
};

var fillContext = function (user_account, done) {
    tables.salon.find({
        where: {
            owner_id: user_account.id
        }
    }).then(function (result) {
        done(null, createContext(user_account, result));
    });
};

var localStrategy = new LocalStrategy(function (username, password, done) {
    tables.user_account.find({
        where: {
            username: username,
            password: md5(password)
        }
    }).then(function (user) {
        if (user) {
            fillContext(user, done);
        } else {
            return done("Auth failed, user does not exists");
        }
    });

});

var facebookStrategy = new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
        tables.user_account.find({
            where: {
                fb_id: profile.id
            }
        }).then(function (result) {
            if (result && result.fb_id == profile.id) {
                fillContext(result, done);
            } else {
                console.log(result);
                done("Cannot match FB user");
            }
        }).error(function (error) {
            done("Internal error, check the log");
        });
    });


var issueToken = function (user, done) {
    var token = new Date().getTime();
    token = user.salon_id + '-' + token + '-' + user.user_account_id;
    //saveRememberMeToken(token, user, function (err) {
    //    if (err) {
    //        return done(err);
    //    }
        return done(null, encrypt(token));
    //});
};


var rememberMeStrategy = new RememberMeStrategy(
    function (token, done) {
        try{
            consumeRememberMeToken(decrypt(token), function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    console.log("user is out of session");
                    return done(null, false);
                }
                // init user
                return done(null, user);
            });
        } catch (e) {
            console.log("Invalid token: ", token);
            return done(null, false, "Invalid token - Not Authorized.");
        }

    },
    function (user, done) {
        return issueToken(user, done);
    }
);

module.exports = function (app) {

    passport.use(facebookStrategy);
    passport.use(localStrategy);
    passport.use(rememberMeStrategy);

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    app.use(express.session({
        secret: "mysecret"
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.authenticate('remember-me'));


    app.use(require("../interceptors/authInterceptor"));

    app.post('/login', passport.authenticate('local', {
            //successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }),
        function (req, res, next) {
            // Issue a remember me cookie if the option was checked
            if (!req.body.rememberMe) {
                return next();
            }

            issueToken(req.user, function (err, token) {
                if (err) {
                    return next(err);
                }
                res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: 6048000000});
                return next();
            });
        },
        function (req, res) {
            res.redirect('/');
        });


    // Redirect the user to Facebook for authentication. When complete,
    // Facebook will redirect the user back to the application at
    // /auth/facebook/callback
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'public_profile', 'user_friends']
    }));

    // Facebook will redirect the user to this URL after approval. Finish the
    // authentication process by attempting to obtain an access token. If
    // access was granted, the user will be logged in. Otherwise,
    // authentication has failed.
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    // A link or button can be placed on a web page, allowing one-click login
    // with Facebook.
    // <a href="/auth/facebook">Login with Facebook</a>

    // Log out
    app.get('/logout', function (req, res) {
        res.clearCookie('remember_me');
        req.logout();
        res.redirect('/');
    });
};