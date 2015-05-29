var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");
var _ = require("underscore");
var moment = require("moment");

var workerValidator =  require("../validators/workerValidator");
var generalValidator =  require("../validators/generalValidator");

var workerService = require("../services/workerService");
var appointmentTaskService = require("../services/appointmentTaskService");
var appointmentService = require("../services/appointmentService");

module.exports = (function () {

    var getWorker = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        generalValidator.validateId(req).then(function () {
                return Promise.props({
                    worker: workerService.get(req.user.salon.id, req.query.id),
                    workingDays: workerService.getWorkDays(req.user.salon.id)
                })
            }).then(function (result){

            var worker = result.worker;

            var utcDate = moment.utc(req.query.date);

            var weekday = utcDate.weekday();
            var d = (weekday + 6) % 7;

            var start = result.workingDays[d].start;
            var end = result.workingDays[d].end;
            worker.start = worker.isDeleted? 0: start;
            worker.end = worker.isDeleted? 0: end;
            return worker;
            }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var getWorkerAppointments = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        var appointmentsById;

        Promise.props({
            validateId: generalValidator.validateId(req),
            validateDate: generalValidator.validateDate(req)
        }).then(function () {
            return appointmentService.getForDate(req.user.salon.id, req.query.date);
        }).then(function (result){
            var ids = [];

            result.forEach(function (appointment){
                ids.push(appointment.id);
            });

            appointmentsById = _.indexBy(result, "id");

            return appointmentTaskService.getWorkerAppointments(req.query.id, ids);
        }).then(function (result){
            var appointments  = [];

            var tasksByAppointmentId = _.groupBy(result, "appointmentId");

            _.each(tasksByAppointmentId, function (tasksByAppointment, id){
                var appointment = appointmentsById[id];
                appointment.tasks = tasksByAppointment;
                appointments.push(appointment);
            });

            return appointments;
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var getWorkers = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        workerService.getWorkers(req.user.salon.id).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var history = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        workerService.history(req.user.salon.id).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var saveWorker = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        workerValidator.validateCreateWorker(req).then(function (){
            if(req.body.id) {
                return workerService.updateWorker(req.user.user_account.id, req.user.salon.id, req.body);
            } else {
                return workerService.createWorker(req.user.user_account.id, req.user.salon.id, req.body);
            }
        }).then(function (id){
            formatResponseCallback(null, {
                id: id
            });
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var removeWorker = function (req, res) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        workerService.removeWorker(req.user.user_account.id, req.user.salon.id, req.query).then(function (){
            formatResponseCallback(null, true);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var reorderWorkers = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        generalValidator.validateReorder(req).then(function (){
                return workerService.reorderWorkers(req.user.user_account.id, req.user.salon.id, req.body);
        }).then(function (){
            formatResponseCallback(null, true);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    return {
        history: history,
        getWorker: getWorker,
        saveWorker: saveWorker,
        getWorkers: getWorkers,
        removeWorker: removeWorker,
        reorderWorkers: reorderWorkers,
        getWorkerAppointments: getWorkerAppointments
    };

}());
