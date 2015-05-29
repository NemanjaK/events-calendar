var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");
var _ = require("underscore");

var workerValidator =  require("../validators/workerValidator");
var generalValidator =  require("../validators/generalValidator");

var statsService = require("../services/statsService");
var workerService = require("../services/workerService");
var salonService = require("../services/salonService");

module.exports = (function () {

    var services = function(req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        Promise.props({
            startEndDate: generalValidator.validateStartEndDate(req),
            workerId: workerValidator.validateWorkerId(req)
        }).then(function (){
            if(req.query.workerId != -1){
                return workerService.statsServices(req.user.salon.id, req.query.start, req.query.end, req.query.workerId);
            } else {
                return salonService.statsServices(req.user.salon.id, req.query.start, req.query.end);
            }
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var clients = function(req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        generalValidator.validateStartEndDate(req).then(function (){
            return salonService.statsClients(req.user.salon.id, req.query.start, req.query.end);
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    var workers = function(req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        generalValidator.validateStartEndDate(req).then(function (){
            return Promise.props({
                profit : salonService.statsWorkersByProfit(req.user.salon.id, req.query.start, req.query.end),
                clients : salonService.statsWorkersByClients(req.user.salon.id, req.query.start, req.query.end),
                workers: workerService.history(req.user.salon.id)
             });
        }).then(function (result){
            var workers = _.indexBy(result.workers, "id");
            var clientsData = [];
            var profitData = [];
            result.profit.forEach(function (d){
                profitData.push({
                    total: d.total,
                    worker: workers[d.workerId]
                });
            });
            result.clients.forEach(function (d){
                clientsData.push({
                    total: d.total,
                    worker: workers[d.workerId]
                });
            });
            return {
                clients: clientsData,
                profit: profitData
            };
         }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };


    var appointments = function(req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);

        Promise.props({
            startEndDate: generalValidator.validateStartEndDate(req),
            workerId: workerValidator.validateWorkerId(req)
        }).then(function (){
            if(req.query.workerId != -1){
                return workerService.statsAppointments(req.user.salon.id, req.query.start, req.query.end, req.query.type, req.query.workerId);
            } else {
                return salonService.statsAppointments(req.user.salon.id, req.query.start, req.query.end, req.query.type);
            }
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    return {
        workers: workers,
        clients: clients,
        services: services,
        appointments: appointments
    };

}());
