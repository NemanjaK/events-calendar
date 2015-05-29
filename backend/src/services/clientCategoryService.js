var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var getCategories = function (customerIds){
        return tables.customer_has_category.findAll({
            where: {
                is_deleted: false,
                customer_id: customerIds
            }
        }).then(function (data){
            var categories = [];
            data.forEach(function (clientCategory) {
                categories.push({
                    categoryId: clientCategory.category_id,
                    customerId: clientCategory.customer_id
                });
            });
            return categories;
        });
    };

    var getClients = function (categoryIds){
        return tables.customer_has_category.findAll({
            where: {
                is_deleted: false,
                category_id: categoryIds
            }
        }).then(function (data){
            var clients = [];
            data.forEach(function (clientCategory) {
                clients.push({
                    categoryId: clientCategory.category_id,
                    customerId: clientCategory.customer_id
                });
            });
            return clients;
        });
    };

    var insertCategories = function (userId, customerId, categoryId, t){
        return tables.customer_has_category.findAll({
            where: {
                customer_id: customerId
            },
            transaction: t
        }).then(function (allCategories){
            var toInsert = [];
            var promises = [];

            allCategories.forEach(function (category) {
                category.is_deleted = true;
            });

            categoryId.forEach(function (id) {
                var found = false;
                allCategories.forEach(function (category) {
                    if(category.category_id == id){
                        category.is_deleted = false;
                        found = true;
                    }
                });
                if(!found){
                    toInsert.push({
                        customer_id: customerId,
                        category_id: id,
                        is_deleted: false,
                        created_by: userId,
                        updated_by: userId
                    });
                }
            });

            allCategories.forEach(function (category){
                promises.push(category.save({
                    transaction: t
                }));
            });

            promises.push(tables.customer_has_category.bulkCreate(toInsert, {
                transaction: t
            }));

            return Promise.props({
                all: promises
            });
        });
    };

    var removeClient = function (client, t){
        return tables.customer_has_category.findAll({
            where: {
                customer_id: client.id
            },
            transaction: t
        }).then(function (allCategories){
            var promises = [];

            allCategories.forEach(function (category) {
                category.is_deleted = true;
            });

            allCategories.forEach(function (category){
                promises.push(category.save({
                    transaction: t
                }));
            });

            return Promise.props({
                all: promises
            });
        });
    };


    return {
        removeClient: removeClient,
        getClients: getClients,
        getCategories: getCategories,
        insertCategories: insertCategories
    };

}());

