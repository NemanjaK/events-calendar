var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var update = function (userId, salonId, appointmentId, taskId, workerId, t){


        var data = {
            worker_id: workerId
        };

        return tables.appointment.find({
            where: {
                id: appointmentId,
                salon_id: salonId
            }
        }, {
            transaction: t
        }).then(function (appointment){
            if(appointment) {
                return tables.task.find({
                    where: {
                        appointment_id: appointmentId,
                        base_task_id: taskId
                    }
                }, {
                    transaction: t
                }).then(function (task){
                    return task.updateAttributes(data, {
                        transaction: t
                    }).then(function(){
                        return true;
                    });
                });
            }
            return false;
        });

    };


    return {
        update: update
    };

}());

