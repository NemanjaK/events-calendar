var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var getBaseTasks = function(salonId){
        return tables.base_task.findAll({
            where: {
                salon_id: salonId,
                is_deleted: false
            }
        }).then(function (data){
            var baseTasks = [];
            data.forEach(function (task) {
                baseTasks.push({
                    id: task.id,
                    name : task.name,
                    duration : task.duration,
                    price : task.price,
                    pause : task.pause,
                    order : task.order,
                    cnt : task.cnt
                });
            });
            return baseTasks;
        });
    };

    var history = function(salonId){
        return tables.base_task.findAll({
            where: {
                salon_id: salonId
            }
        }).then(function (data){
            var baseTasks = [];
            data.forEach(function (task) {
                baseTasks.push({
                    id: task.id,
                    name : task.name,
                    duration : task.duration,
                    price : task.price,
                    pause : task.pause,
                    order : task.order,
                    cnt : task.cnt
                });
            });
            return baseTasks;
        });
    };

    var getOrderBy = function(salonId){
        return tables.task_order_by.find({
            where: {
                salon_id: salonId
            }
        }).then(function (data){
            return data? data.type : data;
        });
    };

    var create = function (userId, salonId, baseTask){
        var data = {
            name : baseTask.name,
            duration : baseTask.duration,
            price : baseTask.price,
            order : baseTask.order,
            pause : baseTask.pause,
            cnt : 0,
            is_deleted: false,
            salon_id : salonId,
            created_by: userId,
            updated_by: userId
        };
        return tables.base_task.create(data).then(function (response) {
            return response.id;
        });
    };

    var update = function (userId, salonId, baseTask){
        var data = {
            name : baseTask.name,
            duration : baseTask.duration,
            price : baseTask.price,
            pause : baseTask.pause,
            order : baseTask.order,
            updated_by: userId
        };

        return tables.base_task.find({
            where: {
                id: baseTask.id,
                salon_id: salonId
            }
        }).then(function (bt){
            return bt.updateAttributes(data).then(function (){
                return bt.id;
            });
        });
    };

    var remove = function (userId, salonId, baseTask){
        var data = {
            is_deleted: true,
            updated_by: userId
        };
        return tables.base_task.find({
            where: {
                id: baseTask.id,
                salon_id: salonId
            }
        }).then(function (bt){
            return bt.updateAttributes(data).then(function (){
                return bt.id;
            });
        });
    };

    var saveOrderBy = function (userId, salonId, sort){
        var data = {
            type: sort.type,
            updated_by: userId
        };
        return tables.task_order_by.find({
            where: {
                salon_id: salonId
            }
        }).then(function (s){
            return s.updateAttributes(data);
        });
    };

    var reorder = function (userId, salonId, baseTasks) {
        return tables.base_task.findAll({
            where: {
                salon_id: salonId,
                is_deleted: false
            }
        }).then(function (dbTasks){
            var promises = [];
            baseTasks.forEach(function (task){
                dbTasks.forEach(function (dbTask){
                    if(task.id == dbTask.id && task.order != dbTask.order){
                        promises.push(dbTask.updateAttributes({
                            order : task.order,
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

    var incDecCnt = function (oldTasks, newTasks, t){
        var oldIds  = [];
        var newIds = [];

        oldTasks.forEach(function (task){
            oldIds.push(task.baseTaskId);
        });

        newTasks.forEach(function (task){
            newIds.push(task.id);
        });
        //console.log('0:', oldIds);
        //console.log('n:', newIds);

        var ids = oldIds.filter(function(i) {
            return newIds.indexOf(i) < 0;
        }).concat(newIds.filter(function(i) {
            return oldIds.indexOf(i) < 0;
        }));

        //console.log('service diff:', ids);

        return tables.base_task.findAll({
            where: {
                id: ids
            },
            transaction: t
        }).then(function (dbTasks){
            var promises = [];
            dbTasks.forEach(function (dbTask){
                newIds.forEach(function (id){
                    if(id == dbTask.id){
                        promises.push(dbTask.increment('cnt'));
                    }
                });
            });

            dbTasks.forEach(function (dbTask){
                oldIds.forEach(function (id){
                    if(id == dbTask.id){
                        promises.push(dbTask.decrement('cnt'));
                    }
                });
            });

            return Promise.props({
                all: promises
            });

        });
    };

    return {
        remove: remove,
        create: create,
        update: update,
        reorder: reorder,
        history: history,
        incDecCnt: incDecCnt,
        getOrderBy: getOrderBy,
        saveOrderBy: saveOrderBy,
        getBaseTasks: getBaseTasks
    };

}());

