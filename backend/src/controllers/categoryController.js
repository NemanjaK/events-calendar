var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");

var categoryService = require("../services/categoryService");
var categoryValidator =  require("../validators/categoryValidator");

var clientCategoryService = require("../services/clientCategoryService");

module.exports = (function () {

    var getAll = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        var dto;
        Promise.props({
            categories : categoryService.getAll(req.user.salon.id)
        }).then(function (result){
            dto = result;

            var ids = [];
            result.categories.forEach(function (category){
                ids.push(category.id);
                category.clientIds = [];
            });

            return clientCategoryService.getClients(ids);
        }).then(function (result){

            dto.categories.forEach(function (category){
                result.forEach(function (link){
                    if(category.id == link.categoryId){
                        category.clientIds.push(link.customerId);
                    }
                });
            });

            return dto;
        }).then(function (result){
            formatResponseCallback(null, result.categories);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var save = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        categoryValidator.validateCreateCategory(req).then(function (){
            if(req.body.id) {
                return categoryService.update(req.user.user_account.id, req.user.salon.id, req.body);
            } else {
                return categoryService.create(req.user.user_account.id, req.user.salon.id, req.body);
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
        categoryService.remove(req.user.user_account.id, req.user.salon.id, req.query).then(function (){
            formatResponseCallback(null, true);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var reorder = function (req, res){

    };

    return {
        save: save,
        getAll: getAll,
        remove: remove,
        reorder: reorder
    };

}());
