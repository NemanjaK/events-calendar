var Promise = require("bluebird");
var md5 = require("MD5");
var accountService = require("../services/accountService");

module.exports = (function () {

    var validate = function(req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent.",
                code: "ERROR_NO_DATA"
            });
        } else if (!req.body.username) {
            defer.reject({
                message: "Missing or empty attribute [username].",
                code: "ERROR_MISSING_USERNAME"
            });
        } else if ((req.body.passwordOld && !req.body.passwordNew) ||  (!req.body.passwordOld && req.body.passwordNew)) {
            defer.reject({
                message: "If old password is entered new password should be entered as well and vice versa.",
                code: "ERROR_EMPTY_OLD_NEW_PASSWORD"
            });
        } else if(req.body.passwordOld && req.body.passwordNew){
            accountService.getAccount(req.user.user_account.id).then(function (account){
                var passwordOld =  md5(req.body.passwordOld);
                if(account.password != passwordOld){
                    defer.reject({
                        message: "Invalid old password.",
                        code: "ERROR_INVALID_OLD_PASSWORD"
                    });
                } else {
                    defer.resolve();
                }
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    return {
        validate : validate
    };

}());
