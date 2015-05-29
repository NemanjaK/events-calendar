var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var saveSalon = function(userId, salonId, data, t){
        return tables.salon.find({
            where: {
                id: salonId
            }
        }).then(function (salon){

            return salon.updateAttributes({
                name: data.name,
                address: data.address,
                country: data.country,
                currency: data.currency,
                city: data.city,
                phone: data.phone,
                email: data.email,
                updated_by: userId
            }, {
                transaction: t
            });
        });
    };

    var saveWorkDays = function (userId, salonId, data, t){
        return tables.week_days.findAll({
            where: {
                salon_id: salonId
            }
        }).then(function (days){
            var promisses = [];
            days.forEach(function (day){
                data.forEach(function (d){
                    if(d.id == day.id) {
                        promisses.push(day.updateAttributes({
                            order: d.order,
                            start: d.start,
                            end: d.end,
                            off: d.off,
                            updated_by: userId
                        }, {
                            transaction: t
                        }));
                    }
                });
            });

            return Promise.all(promisses);
        });
    };


    var getSalon = function(salonId){
        return tables.salon.find({
            where: {
                id: salonId
            }
        }).then(function (salon){
            return {
                name: salon.name,
                alias: salon.alias,
                address: salon.address,
                country: salon.country,
                currency: salon.currency,
                city: salon.city,
                phone: salon.phone,
                email: salon.email,
                created: salon.created
            };
        });
    };

    var getWorkDays = function (salonId){
        return tables.week_days.findAll({
            where: {
                salon_id: salonId
            }
        }).then(function (data){
            var days = [];
            data.forEach(function (day){
                days.push({
                    id: day.id,
                    order: day.order,
                    start: day.start,
                    end: day.end,
                    off: day.off
                });
            });
            return days;
        });
    };


    var statsAppointments = function (salonId, start, end, type) {
        var date = (type == 'm'? 'MONTH(date)' : 'date');
        return sequelize.query(
            "SELECT " + date + " as date, COUNT(date) as cnt, sum(total) as sum "
            + "FROM "
            + "(SELECT DISTINCT A.* "
            + "FROM "
            + "appointment A "
            + "WHERE A.is_deleted = 0 "
            + "AND A.salon_id = :salonId "
            + "AND date BETWEEN :start AND :end) AS stat "
            + "GROUP BY " + date + ";",
            null,
            {raw: true},
            {
                salonId: salonId,
                start: start,
                end: end
            }
        );
    };

    var statsServices = function (salonId, start, end) {
        return sequelize.query(
            "SELECT BT.id, BT.name, count(BT.id) as cnt "
            + "FROM task T "
            + "INNER JOIN appointment A ON A.id = T.appointment_id "
            + "AND A.is_deleted = 0 "
            + "AND A.salon_id = :salonId "
            + "AND A.date BETWEEN :start AND :end "
            + "INNER JOIN base_task BT ON T.base_task_id = BT.id "
            + "GROUP BY BT.id "
            + "ORDER BY cnt DESC ;",
            null,
            {raw: true},
            {
                salonId: salonId,
                start: start,
                end: end
            }
        );
    };

    var statsClients = function (salonId, start, end) {
        return sequelize.query(
            "SELECT C.id, C.first_name as firstName, C.last_name as lastName, count(C.id) as cnt, sum(A.total) as sum "
            + "FROM appointment A "
            + "INNER JOIN customer C ON A.customer_id = C.id "
            + "AND A.is_deleted = 0 "
            + "AND A.salon_id = :salonId "
            + "AND A.date BETWEEN :start AND :end "
            + "GROUP BY C.id "
            + "ORDER BY sum DESC LIMIT 10 ;",
            null,
            {raw: true},
            {
                salonId: salonId,
                start: start,
                end: end
            }
        );
    };

    var statsWorkersByProfit = function (salonId, start, end) {
        return sequelize.query(
            "SELECT T.worker_id as workerId, sum(BT.price) as total "
            + "FROM task T "
            + "INNER JOIN appointment A ON A.is_deleted = 0 "
            + "AND A.id = T.appointment_id "
            + "AND A.salon_id = :salonId "
            + "AND A.date BETWEEN :start AND :end "
            + "INNER JOIN base_task BT ON BT.id = T.base_task_id "
            + "GROUP BY worker_id "
            + "ORDER BY total DESC ;",
            null,
            {raw: true},
            {
                salonId: salonId,
                start: start,
                end: end
            }
        );
    };

    var statsWorkersByClients = function (salonId, start, end) {
        return sequelize.query(
            "SELECT WC.worker_id as workerId , count(WC.id) as total "
            + "FROM (SELECT DISTINCT "
            + "T.worker_id, A.id "
            + "FROM task T INNER JOIN "
            + "appointment A ON A.is_deleted = 0 "
            + "AND A.id = T.appointment_id "
            + "AND A.salon_id = :salonId "
            + "AND A.date BETWEEN :start AND :end ) WC "
            + "GROUP BY WC.worker_id "
            + "ORDER BY total DESC ;",
            null,
            {raw: true},
            {
                salonId: salonId,
                start: start,
                end: end
            }
        );
    };


    return {
        getSalon: getSalon,
        saveSalon: saveSalon,
        getWorkDays: getWorkDays,
        saveWorkDays: saveWorkDays,
        statsClients: statsClients,
        statsServices: statsServices,
        statsAppointments: statsAppointments,
        statsWorkersByProfit: statsWorkersByProfit,
        statsWorkersByClients: statsWorkersByClients
    };

}());