var Promise = require("bluebird");
var md5 = require("MD5");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var saveAccount = function(accountId, data){
        return tables.user_account.find({
            where: {
                id: accountId
            }
        }).then(function (account){
            var d = {
                username: data.username,
                lang: data.lang,
                updated_by: accountId
            };

            if(data.passwordNew) {
                d.password = md5(data.passwordNew);
            }

            return account.updateAttributes(d);
        });
    };


    var getAccount = function(accountId){
        return tables.user_account.find({
            where: {
                id: accountId
            }
        }).then(function (account){
            return {
                username: account.username,
                lang: account.lang,
                firsName: account.first_name,
                lastName: account.last_name,
                email: account.e_mail,
                password: account.password
            };
        });
    };

    return {
        getAccount : getAccount,
        saveAccount: saveAccount
    };

}());