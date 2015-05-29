var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");

var languageService = require("../services/languageService");

module.exports = (function () {

    var getAll = function(req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        return languageService.getAll().then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    return {
        getAll: getAll
    };

}());
