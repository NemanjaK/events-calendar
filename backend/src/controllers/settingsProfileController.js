var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");

var profileValidator =  require("../validators/profileValidator");

var salonService = require("../services/salonService");

module.exports = (function () {

        var saveProfile = function(req, res){
            sequelize.transaction(function (t) {
                var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

                profileValidator.validate(req).then(function (){
                    return Promise.props({
                        salon: salonService.saveSalon(req.user.user_account.id, req.user.salon.id, req.body, t),
                        workingDays: salonService.saveWorkDays(req.user.user_account.id, req.user.salon.id, req.body.workingDays, t)
                    });
                }).then(function (){
                    t.commit();
                    formatResponseCallback(null, true);
                }).catch(function (error){
                    t.rollback();
                    formatResponseCallback({
                        error: error
                    }, true);
                });
            });
        };

        var getProfile = function(req, res){
            var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
            Promise.props({
                salon: salonService.getSalon(req.user.salon.id),
                workingDays: salonService.getWorkDays(req.user.salon.id)
            }).then(function (result){
                result.salon.workingDays = result.workingDays;
                formatResponseCallback(null, result.salon);
            }).catch(function (error){
                formatResponseCallback({
                    error: error
                }, true);
            });
        };

    return {
        saveProfile : saveProfile,
        getProfile: getProfile
    };

}());
