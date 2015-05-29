var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");

var accountValidator =  require("../validators/accountValidator");

var accountService = require("../services/accountService");

var LANG_COOKIE = 'cshdLang';

module.exports = (function () {

    var saveAccount = function(req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        accountValidator.validate(req).then(function (){
            return accountService.saveAccount(req.user.user_account.id, req.body);
        }).then(function (){
            var lang = req.cookies[LANG_COOKIE];

            if(req.body.lang != lang){
                res.cookie(LANG_COOKIE, req.body.lang || 'en', { maxAge: 315360000, httpOnly: false });
            }
        }).then(function (){
            formatResponseCallback(null, true);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };



    var getAccount = function(req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        Promise.props({
            account: accountService.getAccount(req.user.user_account.id)
        }).then(function (result){
            formatResponseCallback(null, {
                username: result.account.username,
                firsName: result.account.firsName,
                lastName: result.account.lastName,
                email: result.account.email,
                lang: result.account.lang
            });

            res.cookie(LANG_COOKIE, result.account.lang || 'en', { maxAge: 315360000, httpOnly: false });
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    return {
        saveAccount: saveAccount,
        getAccount: getAccount
    };

}());
