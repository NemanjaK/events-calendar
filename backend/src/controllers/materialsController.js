var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");

var materialValidator =  require("../validators/materialValidator");
var generalValidator =  require("../validators/generalValidator");

var materialService = require("../services/materialService");

module.exports = (function () {

    var getAll = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        Promise.props({
            materials : materialService.getAll(req.user.salon.id),
            orderBy: materialService.getOrderBy(req.user.salon.id)
        }).then(function (result){
            formatResponseCallback(null, {
                materials: result.materials,
                orderBy: result.orderBy
            });
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var save = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        materialValidator.validateCreateMaterial(req).then(function (){
            if(req.body.id) {
                return materialService.update(req.user.user_account.id, req.user.salon.id, req.body);
            } else {
                return materialService.create(req.user.user_account.id, req.user.salon.id, req.body);
            }
        }).then(function (response){
            formatResponseCallback(null, response);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var remove = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        materialService.remove(req.user.user_account.id, req.user.salon.id, req.query).then(function (){
            formatResponseCallback(null, true);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var reorder = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        generalValidator.validateReorder(req).then(function (){
            return materialService.reorder(req.user.user_account.id, req.user.salon.id, req.body);
        }).then(function (){
            formatResponseCallback(null, true);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var saveOrderBy = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        materialService.saveOrderBy(req.user.user_account.id, req.user.salon.id, req.body).then(function (){
            formatResponseCallback(null, true);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    return {
        save: save,
        getAll: getAll,
        remove: remove,
        reorder: reorder,
        saveOrderBy: saveOrderBy
    };

}());
