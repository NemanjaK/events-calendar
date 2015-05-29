var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;
var moment = require("moment");


module.exports = (function () {

    var history = function (salonId, clientId, limit, offset) {

        return tables.appointment.findAll({
            where: {
                salon_id: salonId,
                customer_id: clientId,
                is_deleted: false
            },
            order: [["date","DESC"], ["start", "DESC"]],
            limit: limit,
            offset: offset
        }).then(function (data){
            var appointments = [];
            data.forEach(function (appointment) {
                appointments.push({
                    id: appointment.id,
                    price: appointment.price,
                    discount: appointment.discount,
                    total: appointment.total,
                    comment: appointment.comment,
                    date: moment.utc(appointment.date).format("YYYY-MM-DD"),
                    start: appointment.start,
                    end: appointment.end
                });
            });
            return appointments;
        });
    };

    var historyCount = function (salonId, clientId) {

        return tables.appointment.count({
            where: {
                salon_id: salonId,
                customer_id: clientId,
                is_deleted: false
            }
        }).then(function (cnt){
            return cnt;
        });
    };

    return {
        history: history,
        historyCount: historyCount
    };

}());

