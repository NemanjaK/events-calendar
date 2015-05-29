var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var create = function (userId, appointmentId, workerId, tasks, t){
        var data = [];
        tasks.forEach(function(task){
            data.push({
                base_task_id: task.id,
                worker_id: workerId,
                appointment_id: appointmentId,
                order: task.order,
                start: task.start,
                end: task.end,
                pause: task.pause || null,
                created_by: userId,
                updated_by: userId
            });
        });

        return tables.task.bulkCreate(data, {
            transaction: t
        });
    };

    var edit = function (userId, appointmentId, workerId, tasks, t){
        return tables.task.destroy({
            appointment_id: appointmentId
        }, {
            transaction: t
        }).then(function (){
            return create(userId, appointmentId, workerId, tasks, t);
        });
    };


    var update = function (userId, appointmentId, tasks, t){
        return tables.task.destroy({
            appointment_id: appointmentId
        }, {
            transaction: t
        }).then(function (){
            var data = [];
            tasks.forEach(function(taskWorker){
                data.push({
                    base_task_id: taskWorker.task.id,
                    worker_id: taskWorker.workerId,
                    appointment_id: appointmentId,
                    order: taskWorker.task.order,
                    start: taskWorker.task.start,
                    end: taskWorker.task.end,
                    pause: taskWorker.task.pause || null
                });
            });

            return tables.task.bulkCreate(data, {
                transaction: t
            });
        });
    };

    var get = function (appointmentId, t){
        return tables.task.findAll({
            where: {
                appointment_id : appointmentId
            },
            transaction: t
        }).then(function (dbTasks){
            var tasks = [];
            dbTasks.forEach(function(dbTask){
                tasks.push({
                    id: dbTask.id,
                    start: dbTask.start,
                    end: dbTask.end,
                    pause: dbTask.pause,
                    baseTaskId: dbTask.base_task_id,
                    workerId: dbTask.worker_id,
                    order: dbTask.order,
                    name: dbTask.name
                });
            });
            return tasks;
        });
    };

    var getTasksForIds = function (appointmentIds, t){
        return tables.task.findAll({
            where: {
                appointment_id : appointmentIds
            },
            transaction: t
        }).then(function (dbTasks){
            var tasks = [];
            dbTasks.forEach(function(dbTask){
                tasks.push({
                    id: dbTask.id,
                    start: dbTask.start,
                    end: dbTask.end,
                    pause: dbTask.pause,
                    baseTaskId: dbTask.base_task_id,
                    workerId: dbTask.worker_id,
                    order: dbTask.order,
                    name: dbTask.name,
                    appointmentId: dbTask.appointment_id
                });
            });
            return tasks;
        });
    };
    
    var getWorkerAppointments = function (workerId, appointmentIds){
        return tables.task.findAll({
            where: {
                appointment_id : appointmentIds,
                worker_id: workerId
            }
        }).then(function (dbTasks){
            var appointments = [];
            dbTasks.forEach(function(dbTask){
                appointments.push({
                    id: dbTask.id,
                    start: dbTask.start,
                    end: dbTask.end,
                    pause: dbTask.pause,
                    baseTaskId: dbTask.base_task_id,
                    workerId: dbTask.worker_id,
                    order: dbTask.order,
                    name: dbTask.name,
                    appointmentId: dbTask.appointment_id
                });
            });
            return appointments;
        });
    };

    return {
        get: get,
        edit: edit,
        create: create,
        update: update,
        getTasksForIds: getTasksForIds,
        getWorkerAppointments: getWorkerAppointments
    };

}());

