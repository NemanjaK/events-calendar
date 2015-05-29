var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");

var appointmentValidator =  require("../validators/appointmentValidator");
var generalValidator = require("../validators/generalValidator");

var appointmentService = require("../services/appointmentService");
var clientService = require("../services/clientService");
var appointmentTaskService = require("../services/appointmentTaskService");
var baseTaskService = require("../services/baseTaskService");
var materialInUseService = require("../services/materialInUseService");
var materialService = require("../services/materialService");

module.exports = (function () {

    var create = function(req, res){
        sequelize.transaction(function (t) {
            var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
            var id = -1;

            appointmentValidator.validateCreate(req).then(function (){
                return appointmentService.create(req.user.user_account.id, req.user.salon.id, req.body.appointment, req.body.customer, t);
            }).then(function (appointmentId){
                id = appointmentId;
                return appointmentTaskService.create(req.user.user_account.id, appointmentId, req.body.workerId, req.body.tasks,  t);
            }).then(function (){
                return baseTaskService.incDecCnt([], req.body.tasks,  t);
            }).then(function (){
                t.commit();
                formatResponseCallback(null, {
                    id : id
                });
            }).catch(function (error){
                t.rollback();
                formatResponseCallback({
                    error: error
                }, true);
            });
        });
    };


    var edit = function(req, res){
        sequelize.transaction(function (t) {
            var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

            appointmentValidator.validateEdit(req).then(function (){
                var promisses = {
                    appointmentId: appointmentService.update(req.user.user_account.id, req.user.salon.id, req.body.appointment, t)
                };
                if(req.body.tasks.length){
                    promisses.oldTasks = appointmentTaskService.get(req.body.appointment.id,  t);
                }
                promisses.oldMaterials =  materialInUseService.get(req.body.appointment.id,  t);

                return Promise.props(promisses);
            }).then(function (result){
                var promisses = {};
                if(req.body.tasks.length){
                    promisses.tasks = appointmentTaskService.edit(req.user.user_account.id, result.appointmentId, req.body.workerId, req.body.tasks,  t);
                    promisses.baseTaskIncDec =  baseTaskService.incDecCnt(result.oldTasks, req.body.tasks,  t);
                }
                promisses.materials =  materialInUseService.update(result.appointmentId, req.body.materials,  t);
                promisses.materialsIncDecCnt =  materialService.incDecCnt(result.oldMaterials, req.body.materials,  t);

                return Promise.props(promisses);
            }).then(function (){
                t.commit();
                formatResponseCallback(null, true);
            }).catch(function (error){
                t.rollback();
                formatResponseCallback({
                    error: error
                }, true);
            });
        });
    };

    var get = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        var data;
        Promise.props({
            appointment: appointmentService.get(req.user.salon.id, req.params.id),
            materialsInUse: materialInUseService.get(req.params.id),
            appointmentTasks: appointmentTaskService.get(req.params.id)
        }).then(function (result){
            data = result.appointment;
            data.tasks = result.appointmentTasks;
            data.materials = result.materialsInUse;

            return clientService.get(req.user.salon.id, data.customerId);
        }).then(function (result){
            data.customer = result;

            data.isOnMultipleWorkers = false;

            return data;
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var remove = function (req, res) {
        sequelize.transaction(function (t) {
            var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
            generalValidator.validateId(req).then(function (){
                return appointmentService.remove(req.user.user_account.id, req.user.salon.id, req.query, t);
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

    var update = function(req, res){
        sequelize.transaction(function (t) {
            var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

            appointmentValidator.validateUpdate(req).then(function (){
                return Promise.props({
                    appointmentId: appointmentService.update(req.user.user_account.id, req.user.salon.id, req.body.appointment, t),
                    services: appointmentTaskService.update(req.user.user_account.id, req.body.appointment.id, req.body.taskWorker,  t)
                });
            }).then(function (){
                t.commit();
                formatResponseCallback(null, true);
            }).catch(function (error){
                t.rollback();
                formatResponseCallback({
                    error: error
                }, true);
            });
        });
    };

    return {
        get: get,
        edit: edit,
        update: update,
        create: create,
        remove: remove
    };

}());
