var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {


    var getWorkers = function(salonId){
        return tables.worker.findAll({
            where: {
                salon_id: salonId,
                is_deleted: false
            }
        }).then(function (workers){
            var result = [];
            workers.forEach(function (worker){
                result.push({
                    id: worker.id,
                    email: worker.email,
                    phone: worker.phone,
                    lastName: worker.last_name,
                    firstName: worker.first_name,
                    order: worker.order,
                    color: worker.color,
                    img: worker.img
                });
            });
            return result;
        });
    };

    var get = function(salonId, id){
        return tables.worker.find({
            where: {
                salon_id: salonId,
                id: id
            }
        }).then(function (worker){
            var result  = {
                    id: worker.id,
                    email: worker.email,
                    phone: worker.phone,
                    lastName: worker.last_name,
                    firstName: worker.first_name,
                    order: worker.order,
                    color: worker.color,
                    img: worker.img,
                    isDeleted: worker.is_deleted
                };
            return result;
        });
    };

    var getWorkDays = function(salonId){
        return tables.week_days.findAll({
            where: {
                salon_id: salonId
            },
            order: [["order","ASC"]]
        }).then(function (days){
            var result = [];
            days.forEach(function (day){
                result.push({
                    id: day.id,
                    off: day.off,
                    order: day.order,
                    start: day.start,
                    end: day.end
                });
            });
            return result;
        });
    };


    var history = function(salonId){
        return tables.worker.findAll({
            where: {
                salon_id: salonId
            }
        }).then(function (workers){
            var result = [];
            workers.forEach(function (worker){
                result.push({
                    id: worker.id,
                    email: worker.email,
                    phone: worker.phone,
                    lastName: worker.last_name,
                    firstName: worker.first_name,
                    order: worker.order,
                    color: worker.color,
                    img: worker.img,
                    isDeleted: worker.is_deleted
                });
            });
            return result;
        });
    };

    var createWorker = function (userId, salonId, worker){
        var data = {
            first_name: worker.firstName,
            last_name: worker.lastName,
            email: worker.email,
            phone: worker.phone,
            color: worker.color,
            order: worker.order,
            img: 'default-avatar.png',
            salon_id: salonId,
            is_deleted: false,
            created_by: userId,
            updated_by: userId
        };
        return tables.worker.create(data).then(function (response) {
            return response.id;
        });
    };

    var updateWorker = function (userId, salonId, worker){
        var data = {
            first_name: worker.firstName,
            last_name: worker.lastName,
            email: worker.email,
            phone: worker.phone,
            color: worker.color,
            updated_by: userId
        };

        return tables.worker.find({
            where: {
                id: worker.id,
                salon_id: salonId
            }
        }).then(function (w){
            return w.updateAttributes(data).then(function (response) {
                return response.id;
            });
        });
    };

    var removeWorker = function (userId, salonId, worker){
        var data = {
            is_deleted: true,
            updated_by: userId
        };
        return tables.worker.find({
            where: {
                id: worker.id,
                salon_id: salonId
            }
        }).then(function (w){
            return w.updateAttributes(data);
        });
    };

    var reorderWorkers = function (userId, salonId, workers) {
        return tables.worker.findAll({
            where: {
                salon_id: salonId,
                is_deleted: false
            }
        }).then(function (dbWorkers){
            var promises = [];
            workers.forEach(function (worker){
                dbWorkers.forEach(function (dbWorker){
                    if(worker.id == dbWorker.id && worker.order != dbWorker.order){
                        promises.push(dbWorker.updateAttributes({
                            order : worker.order,
                            updated_by: userId
                        }));
                    }
                });
            });

            return Promise.props({
                all: promises
            });
        });
    };

    var statsAppointments = function (salonId, start, end, type, workerId) {
        var date = (type == 'm'? 'MONTH(date)' : 'date');
        return sequelize.query(
            "SELECT SUM.date, SUM.sum, CNT.cnt FROM "
            + "(SELECT " + date + " as date, COUNT(date) as cnt "
            + "FROM "
            + "(SELECT DISTINCT A.* "
            + "FROM "
            + "appointment A INNER JOIN task T "
            + "ON A.id = T.appointment_id "
            + "AND A.is_deleted = 0 "
            + "AND T.worker_id = :workerId "
            + "AND A.salon_id = :salonId "
            + "AND A.date BETWEEN :start AND :end) AS stat "
            + "GROUP BY " + date + ")  CNT "
            + "INNER JOIN "
            + "( SELECT " + date + " as date, sum(BT.price) as sum "
            + "FROM "
            + "task T INNER JOIN appointment A "
            + "ON A.id = T.appointment_id "
            + "AND A.is_deleted = 0 "
            + "AND T.worker_id = :workerId "
            + "AND A.salon_id = :salonId "
            + "AND A.date BETWEEN :start AND :end "
            + "INNER JOIN base_task BT ON BT.id = T.base_task_id "
            + "GROUP BY " + date + " )  SUM ON SUM.date = CNT.date ;",
            null,
            {raw: true},
            {
                salonId: salonId,
                workerId: workerId,
                start: start,
                end: end
            }
        );
    };

    var statsServices = function (salonId, start, end, workerId) {
        return sequelize.query(
            "SELECT BT.id, BT.name, count(BT.id) as cnt "
            + "FROM task T "
            + "INNER JOIN appointment A ON A.id = T.appointment_id "
            + "AND A.is_deleted = 0 "
            + "AND T.worker_id = :workerId "
            + "AND A.salon_id = :salonId "
            + "AND A.date BETWEEN :start AND :end "
            + "INNER JOIN base_task BT ON T.base_task_id = BT.id "
            + "GROUP BY BT.id "
            + "ORDER BY cnt DESC ;",
            null,
            {raw: true},
            {
                salonId: salonId,
                workerId: workerId,
                start: start,
                end: end
            }
        );
    };

    return {
        get: get,
        history: history,
        getWorkers: getWorkers,
        getWorkDays: getWorkDays,
        updateWorker: updateWorker,
        createWorker: createWorker,
        removeWorker: removeWorker,
        statsServices: statsServices,
        reorderWorkers: reorderWorkers,
        statsAppointments: statsAppointments
    };

}());