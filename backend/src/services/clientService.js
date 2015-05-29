var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var get = function(salonId, id){
        return tables.customer.find({
            where: {
                id: id,
                salon_id: salonId,
                is_deleted: false
            }
        }).then(function (client){
            var data = {
                id: client.id,
                firstName: client.first_name,
                lastName: client.last_name,
                email: client.e_mail,
                phone: client.phone,
                birthday: client.birthday,
                address: client.address,
                social: client.social,
                note: client.note
            };
            return data;
        });
    };

    var getAll = function(salonId, offset, limit){
        return tables.customer.findAll({
            where: {
                salon_id: salonId,
                is_deleted: false
            },
            order: [["first_name","ASC"]],
            limit: limit,
            offset: offset
        }).then(function (data){
            var clients = [];
            data.forEach(function (client) {
                clients.push({
                    id: client.id,
                    firstName: client.first_name,
                    lastName: client.last_name,
                    email: client.e_mail,
                    phone: client.phone,
                    birthday: client.birthday,
                    address: client.address,
                    social: client.social,
                    note: client.note
                });
            });
            return clients;
        });
    };

    var getByIds = function(salonId, customerIds, offset, limit){
        return tables.customer.findAll({
            where: {
                salon_id: salonId,
                id: customerIds,
                is_deleted: false
            },
            order: [["first_name","ASC"]],
            limit: limit,
            offset: offset
        }).then(function (data){
            var clients = [];
            data.forEach(function (client) {
                clients.push({
                    id: client.id,
                    firstName: client.first_name,
                    lastName: client.last_name,
                    email: client.e_mail,
                    phone: client.phone,
                    birthday: client.birthday,
                    address: client.address,
                    social: client.social,
                    note: client.note
                });
            });
            return clients;
        });
    };

    var getByCustomerIds = function(customerIds){
        return tables.customer.findAll({
            where: {
                id: customerIds,
                is_deleted: false
            }
        }).then(function (data){
            var clients = [];
            data.forEach(function (client) {
                clients.push({
                    id: client.id,
                    firstName: client.first_name,
                    lastName: client.last_name,
                    email: client.e_mail,
                    phone: client.phone,
                    birthday: client.birthday,
                    address: client.address,
                    social: client.social,
                    note: client.note
                });
            });
            return clients;
        });
    };

    var findByIds = function(salonId, val, customerIds, offset, limit){

        var firstName = '';
        var lastName = '';

        var index = val.indexOf(' ');
        if (index != -1) {
            firstName = val.substring(0, index).trim();
            lastName = val.substring(index + 1).trim();
        } else {
            firstName = val;
            lastName = val;
        }

        return tables.customer.findAll({
            where:
                ["salon_id = ? and id in (?) and is_deleted = 0 and (first_name like ? or last_name like ?)", salonId, customerIds, '%' + firstName + '%', '%' + lastName + '%'],
            order: [["first_name","ASC"]],
            limit: limit,
            offset: offset
        }).then(function (data){
            var clients = [];
            data.forEach(function (client) {
                clients.push({
                    id: client.id,
                    firstName: client.first_name,
                    lastName: client.last_name,
                    email: client.e_mail,
                    phone: client.phone,
                    birthday: client.birthday,
                    address: client.address,
                    social: client.social,
                    note: client.note
                });
            });
            return clients;
        });
    };

    var count = function(salonId){
        return tables.customer.count({
            where: {
                salon_id: salonId,
                is_deleted: false
            }
        }).then(function (cnt){
            return cnt;
        });
    };

    var find = function (salonId, val, offset, limit){
        var firstName = '';
        var lastName = '';

        var index = val.indexOf(' ');
        if (index != -1) {
            firstName = val.substring(0, index).trim();
            lastName = val.substring(index + 1).trim();
        } else {
            firstName = val;
            lastName = val;
        }
        return tables.customer.findAll({
            where: ["salon_id = ? and is_deleted = 0 and (first_name like ? or last_name like ?)", salonId, '%' + firstName + '%', '%' + lastName + '%'],
            order: [["first_name","ASC"]],
            limit: limit,
            offset: offset
        }).then(function (data){
            var clients = [];
            data.forEach(function (client) {
                clients.push({
                    id: client.id,
                    firstName: client.first_name,
                    lastName: client.last_name,
                    email: client.e_mail,
                    phone: client.phone,
                    birthday: client.birthday,
                    address: client.address,
                    social: client.social,
                    note: client.note
                });
            });
            return clients;
        });
    };

    var findCount = function (salonId, val){
        var firstName = '';
        var lastName = '';

        var index = val.indexOf(' ');
        if (index != -1) {
            firstName = val.substring(0, index).trim();
            lastName = val.substring(index + 1).trim();
        } else {
            firstName = val;
            lastName = val;
        }
        return tables.customer.count({
            where: ["salon_id = ? and is_deleted = 0 and (first_name like ? or last_name like ? or e_mail like ?)", salonId, '%' + firstName + '%', '%' + lastName + '%', '%' + val + '%']
        }).then(function (cnt){
            return cnt;
        });
    };

    var findByIdsCount = function (salonId, val, clientsIds){
        var firstName = '';
        var lastName = '';

        var index = val.indexOf(' ');
        if (index != -1) {
            firstName = val.substring(0, index).trim();
            lastName = val.substring(index + 1).trim();
        } else {
            firstName = val;
            lastName = val;
        }
        return tables.customer.count({
            where: ["salon_id = ? and id in (?) and is_deleted = 0 and (first_name like ? or last_name like ? or e_mail like ?)", salonId, clientsIds, '%' + firstName + '%', '%' + lastName + '%', '%' + val + '%']
        }).then(function (cnt){
            return cnt;
        });
    };

    var create = function (userId, salonId, client, t){
        var data = {
            first_name: client.firstName,
            last_name: client.lastName,
            e_mail: client.email,
            phone: client.phone,
            birthday: client.birthday,
            address: client.address,
            note: client.note,
            social: client.social,
            is_deleted: false,
            salon_id : salonId,
            created_by: userId,
            updated_by: userId
        };
        return tables.customer.create(data, {
            transaction: t
        }).then(function (response) {
            return response.id;
        });
    };

    var update = function (userId, salonId, client, t){
        var data = {
            first_name: client.firstName,
            last_name: client.lastName,
            e_mail: client.email,
            phone: client.phone,
            birthday: client.birthday,
            address: client.address,
            social: client.social,
            note: client.note,
            updated_by: userId
        };

        return tables.customer.find({
            where: {
                id: client.id,
                salon_id: salonId
            },
            transaction: t
        }).then(function (c){
            return c.updateAttributes(data).then(function (){
                return c.id;
            });
        });
    };

    var remove = function (userId, salonId, client, t){
        var data = {
            is_deleted: true,
            updated_by: userId
        };
        return tables.customer.find({
            where: {
                id: client.id,
                salon_id: salonId
            },
            transaction: t
        }).then(function (c){
            return c.updateAttributes(data, { transaction: t }).then(function (){
                return c.id;
            });
        });
    };

    var reorder = function (salonId, clients) {
    };

    return {
        get: get,
        find: find,
        count: count,
        getAll: getAll,
        remove: remove,
        create: create,
        update: update,
        reorder: reorder,
        getByIds: getByIds,
        findCount:findCount,
        findByIds: findByIds,
        findByIdsCount: findByIdsCount,
        getByCustomerIds: getByCustomerIds
    };

}());

