var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var getAll = function(salonId){
        return tables.category.findAll({
            where: {
                salon_id: salonId,
                is_deleted: false
            }
        }).then(function (data){
            var categories = [];
            data.forEach(function (category) {
                categories.push({
                    id: category.id,
                    name : category.name,
                    color : category.color,
                    order : category.order
                });
            });
            return categories;
        });
    };

    var create = function (userId, salonId, category){
        var data = {
            name : category.name,
            color : category.color,
            order : category.order,
            is_deleted: false,
            salon_id : salonId,
            created_by: userId,
            updated_by: userId
        };
        return tables.category.create(data).then(function (response) {
            return response.id;
        });
    };

    var update = function (userId, salonId, category){
        var data = {
            name : category.name,
            color : category.color,
            order : category.order,
            updated_by: userId
        };

        return tables.category.find({
            where: {
                id: category.id,
                salon_id: salonId
            }
        }).then(function (c){
            return c.updateAttributes(data).then(function (){
                return c.id;
            });
        });
    };

    var remove = function (userId, salonId, category){
        var data = {
            is_deleted: true,
            updated_by: userId
        };
        return tables.category.find({
            where: {
                id: category.id,
                salon_id: salonId
            }
        }).then(function (c){
            return c.updateAttributes(data).then(function (){
                return c.id;
            });
        });
    };


    var reorder = function (salonId, categories) {
    };

    return {
        getAll: getAll,
        remove: remove,
        create: create,
        update: update,
        reorder: reorder
    };

}());

