var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");
var _ = require("underscore");
var moment = require("moment");

var workerService = require("../services/workerService");
var clientService = require("../services/clientService");
var materialService = require("../services/materialService");
var baseTaskService = require("../services/baseTaskService");
var materialInUseService = require("../services/materialInUseService");
var clientCategoryService = require("../services/clientCategoryService");
var appointmentTaskService = require("../services/appointmentTaskService");
var clientAppointmentService = require("../services/clientAppointmentService");

var generalValidator = require("../validators/generalValidator");
var clientValidator = require("../validators/clientValidator");

module.exports = (function () {

    var formatDate = function (date) {
        return moment.utc(date).format("YYYY-MM-DD");
    };

    var getAll = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        var dto = {};
        var count = 0;
        Promise.props({
            filter: generalValidator.validateFilterCategory(req),
            limitOffset: generalValidator.validateLimitOffset(req)
        }).then(function () {

            if(req.query.filterCategory == -1){
                return Promise.props({
                    clients: clientService.getAll(req.user.salon.id, req.query.offset, req.query.limit),
                    count: clientService.count(req.user.salon.id)
                });
            } else {
                return Promise.props({
                    clients: clientCategoryService.getClients([req.query.filterCategory])
                }).then(function (result){
                    var clientsIds = [];
                    result.clients.forEach(function (records){
                        clientsIds.push(records.customerId);
                    });
                    count = result.clients.length;
                    return Promise.props({
                        clients: clientService.getByIds(req.user.salon.id, clientsIds, req.query.offset, req.query.limit)
                    });
                }).then(function (result){
                    result.count = count;
                    return result;
                });
            }

        }).then(function (result){
            dto = result;

            var ids = [];
            result.clients.forEach(function (client){
                ids.push(client.id);
                client.categoryIds = [];
            });

            return clientCategoryService.getCategories(ids);
        }).then(function (result){

            dto.clients.forEach(function (client){
                result.forEach(function (link){
                    if(client.id == link.customerId){
                        client.categoryIds.push(link.categoryId);
                    }
                });
            });

            return dto;
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var save = function (req, res){
        sequelize.transaction(function (t) {
            var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
            var id = -1;
            clientValidator.validateCreateClient(req).then(function (){
                if(req.body.id) {
                    return clientService.update(req.user.user_account.id, req.user.salon.id, req.body, t);
                } else {
                    return clientService.create(req.user.user_account.id, req.user.salon.id, req.body, t);
                }
            }).then(function (response){
                id = response;
                return clientCategoryService.insertCategories(req.user.user_account.id, id, req.body.categories, t);
            }).then(function (){
                t.commit();
                formatResponseCallback(null, id);
            }).catch(function (error){
                t.rollback();
                formatResponseCallback({
                    error: error
                }, true);
            });
        });
    };

    var remove = function (req, res) {
        sequelize.transaction(function (t) {
            var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
            generalValidator.validateId(req).then(function (){
                return Promise.props({
                    client : clientService.remove(req.user.user_account.id, req.user.salon.id, req.query, t),
                    categories: clientCategoryService.removeClient(req.query, t)
                });
            }).then(function (){
                console.log("commit");
                t.commit();
                formatResponseCallback(null, true);
            }).catch(function (error){
                console.log("rollback");
                t.rollback();
                formatResponseCallback({
                    error: error
                }, true);
            });
        });
    };

    var reorder = function (req, res){

    };

    var find = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        var dto;
        var count = 0;

        Promise.props({
            filter: generalValidator.validateFilterCategory(req),
            limitOffset: generalValidator.validateLimitOffset(req),
            search: generalValidator.validateSearch(req)
        }).then(function () {

            if(req.query.filterCategory == -1) {
                return Promise.props({
                    clients: clientService.find(req.user.salon.id, req.query.search, req.query.offset, req.query.limit),
                    count: clientService.findCount(req.user.salon.id, req.query.search)
                });
            } else {
                return Promise.props({
                    clients: clientCategoryService.getClients([req.query.filterCategory])
                }).then(function (result){
                    var clientsIds = [];
                    result.clients.forEach(function (records){
                        clientsIds.push(records.customerId);
                    });
                    count = result.clients.length;
                    return Promise.props({
                        clients: clientService.findByIds(req.user.salon.id, req.query.search, clientsIds, req.query.offset, req.query.limit),
                        count: clientService.findByIdsCount(req.user.salon.id, req.query.search, clientsIds)
                    });
                });
            }
        }).then(function (result){
            dto = result;

            var ids = [];
            result.clients.forEach(function (client){
                ids.push(client.id);
                client.categoryIds = [];
            });

            return clientCategoryService.getCategories(ids);
        }).then(function (result){

            dto.clients.forEach(function (client){
                result.forEach(function (link){
                    if(client.id == link.customerId){
                        client.categoryIds.push(link.categoryId);
                    }
                });
            });

            return dto;
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var get = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        Promise.props({
            client: clientService.get(req.user.salon.id, req.params.id),
            categories: clientCategoryService.getCategories([req.params.id])
        }).then(function (result){
            var client = result.client;
            client.categoryIds = [];

            result.categories.forEach(function (category){
                client.categoryIds.push(category.categoryId);
            });

            return client;
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var prepareHistoryResponse = function (appointments, baseTaskById, workerById, materialsById, tasksByAppointmentId, materialsByAppointmentId) {
        return _.map(appointments, function (appointment) {

            var tasks = tasksByAppointmentId ? tasksByAppointmentId[appointment.id] : [];

            if (tasks) {
                tasks = _.sortBy(tasks, function (task) {
                    return task.order;
                });
            }

            tasks = _.map(tasks, function (task) {
                task.name = baseTaskById[task.baseTaskId].name;

                var worker = workerById[task.workerId];
                task.worker = {
                    firstName : worker.firstName,
                    lastName : worker.lastName
                };

                return task;
            });

            var materials = materialsByAppointmentId ? materialsByAppointmentId[appointment.id] : [];

            materials = _.map(materials, function (link) {
                return materialsById[link.materialId];
            });

            return {
                id: appointment.id,
                price: appointment.price,
                discount: appointment.discount,
                total: appointment.total,
                comment: appointment.comment,
                date: formatDate(appointment.date),
                tasks: tasks,
                materials: materials,
                start: appointment.start,
                end: appointment.end
            };
        });
    };

    var history = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        var appointments = [];

        var baseTaskById = [];
        var workerById = [];
        var materialsById = [];

        var materialsByAppointmentId = [];
        var tasksByAppointmentId = [];

        var count;

        Promise.props({
            id: generalValidator.validateId(req),
            limitOffset: generalValidator.validateLimitOffset(req)
        }).then(function (){
            return Promise.props({
                appointments: clientAppointmentService.history(req.user.salon.id, req.query.id, req.query.limit, req.query.offset),
                count: clientAppointmentService.historyCount(req.user.salon.id, req.query.id),
                materials: materialService.history(req.user.salon.id),
                workers: workerService.history(req.user.salon.id),
                baseTasks: baseTaskService.history(req.user.salon.id)
            });
        }).then(function (result){

            appointments = result.appointments;
            count = result.count;

            baseTaskById = _.indexBy(result.baseTasks, "id");
            workerById = _.indexBy(result.workers, "id");
            materialsById = _.indexBy(result.materials, "id");
            return;
        }).then(function (){
            var ids = [];

            appointments.forEach(function (appointment){
                ids.push(appointment.id);
            });

            return Promise.props({
                materialsInUse: materialInUseService.getMaterialsForIds(ids),
                appointmentTasks: appointmentTaskService.getTasksForIds(ids)
            });
        }).then(function (result){
            tasksByAppointmentId = _.groupBy(result.appointmentTasks, "appointmentId");
            materialsByAppointmentId = _.groupBy(result.materialsInUse, "appointmentId");
            return;
        }).then(function (){
            return prepareHistoryResponse(appointments, baseTaskById, workerById, materialsById, tasksByAppointmentId, materialsByAppointmentId);
        }).then(function (result){
            formatResponseCallback(null, {
                appointments : result,
                count: count
            });
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    return {
        get: get,
        save: save,
        find: find,
        getAll: getAll,
        remove: remove,
        history: history,
        reorder: reorder
    };

}());
