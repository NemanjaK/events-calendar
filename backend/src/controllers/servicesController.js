var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");

var baseTaskValidator =  require("../validators/baseTaskValidator");
var generalValidator =  require("../validators/generalValidator");

var baseTaskService = require("../services/baseTaskService");

module.exports = (function () {

    var getAll = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        Promise.props({
            baseTasks : baseTaskService.getBaseTasks(req.user.salon.id),
            orderBy: baseTaskService.getOrderBy(req.user.salon.id)
        }).then(function (result){
            formatResponseCallback(null, {
                baseTasks: result.baseTasks,
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
        baseTaskValidator.validateCreateBaseTask(req).then(function (){
            if(req.body.id) {
                return baseTaskService.update(req.user.user_account.id, req.user.salon.id, req.body);
            } else {
                return baseTaskService.create(req.user.user_account.id, req.user.salon.id, req.body);
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
        baseTaskService.remove(req.user.user_account.id, req.user.salon.id, req.query).then(function (){
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
            return baseTaskService.reorder(req.user.user_account.id, req.user.salon.id, req.body);
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
        baseTaskService.saveOrderBy(req.user.user_account.id, req.user.salon.id, req.body).then(function (){
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
