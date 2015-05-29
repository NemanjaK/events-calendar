var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;
var moment = require("moment");


module.exports = (function () {
    var create = function (userId, salonId, appointment, customer, t){
        var data = {
            price: appointment.price,
            discount: appointment.discount,
            total: appointment.total,
            date: appointment.date,
            start: appointment.start,
            end: appointment.end,
            customer_id: customer.id,
            salon_id: salonId,
            is_deleted: false,
            created_by: userId,
            updated_by: userId
        };
        return tables.appointment.create(data, {
            transaction: t
        }).then(function (response) {
            return response.id;
        });
    };

    var update = function (userId, salonId, appointment, t){
        var data = {
            price: appointment.price,
            discount: appointment.discount,
            total: appointment.total,
            comment: appointment.comment,
            start: appointment.start,
            end: appointment.end,
            updated_by: userId
        };

        return tables.appointment.find({
            where: {
                id: appointment.id,
                salon_id: salonId
            },
            transaction: t
        }).then(function (a){
            return a.updateAttributes(data, {transaction: t}).then(function (){
                return a.id;
            });
        });
    };


    var get = function (salonId, appointmentId){
        return tables.appointment.find({
            where: {
                id: appointmentId,
                salon_id: salonId
            }
        }).then(function (appointment){
            var data = {
                id: appointment.id,
                price: appointment.price,
                discount: appointment.discount,
                total: appointment.total,
                date: moment.utc(appointment.date).format("YYYY-MM-DD"),
                start: appointment.start,
                end: appointment.end,
                comment: appointment.comment,
                customerId: appointment.customer_id
            };
            return data;
        });
    };

    var getForDate = function (salonId, date){
        return tables.appointment.findAll({
            where: {
                date: date,
                is_deleted: false,
                salon_id: salonId
            }
        }).then(function (appointments){
            var data = [];
            appointments.forEach(function (appointment){
                data.push({
                    id: appointment.id,
                    price: appointment.price,
                    discount: appointment.discount,
                    total: appointment.total,
                    date: date,
                    start: appointment.start,
                    end: appointment.end,
                    comment: appointment.comment,
                    customerId: appointment.customer_id
                });
            });

            return data;
        });
    };

    var remove = function (userId, salonId, appointment, t){
        var data = {
            is_deleted: true,
            updated_by: userId
        };
        return tables.appointment.find({
            where: {
                id: appointment.id,
                salon_id: salonId
            },
            transaction: t
        }).then(function (a){
            return a.updateAttributes(data, { transaction: t }).then(function (){
                return a.id;
            });
        });
    };

    return {
        get: get,
        update: update,
        create: create,
        remove: remove,
        getForDate: getForDate
    };

}());

