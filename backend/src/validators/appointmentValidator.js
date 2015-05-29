var Promise = require("bluebird");

module.exports = (function () {

    var validateCreate = function(req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.body.workerId) {
            defer.reject({
                message: "Missing or empty attribute [workerId]."
            });
        } else if (!req.body.customer) {
            defer.reject({
                message: "Missing or empty attribute [customer]."
            });
        } else if (!req.body.appointment) {
            defer.reject({
                message: "Missing or empty attribute [appointment]."
            });
        } else if (!req.body.tasks) {
            defer.reject({
                message: "Missing or empty attribute [tasks]."
            });
        }  else if (req.body.tasks.constructor !== Array) {
            defer.reject({
                message: "Attribute tasks must be instance of []."
            });
        } else if (req.body.tasks.length === 0) {
            defer.reject({
                message: "Attribute tasks can't be empty []."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    var validateUpdate = function(req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.body.appointment) {
            defer.reject({
                message: "Missing or empty attribute [appointment]."
            });
        } else if (req.body.taskWorker && req.body.taskWorker.constructor !== Array) {
            defer.reject({
                message: "Attribute tasks must be instance of []."
            });
        } else {
            defer.resolve();
        }
        return defer.promise;
    };

    var validateEdit = function(req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.body.workerId) {
            defer.reject({
                message: "Missing or empty attribute [workerId]."
            });
        } else if (!req.body.appointment) {
            defer.reject({
                message: "Missing or empty attribute [appointment]."
            });
        } else if (req.body.tasks && req.body.tasks.constructor !== Array) {
            defer.reject({
                message: "Attribute tasks must be instance of []."
            });
        } else if (req.body.materials && req.body.materials.constructor !== Array) {
            defer.reject({
                message: "Attribute materials must be instance of []."
            });
        } else {
            defer.resolve();
        }
        return defer.promise;
    };

    return {
        validateEdit: validateEdit,
        validateUpdate: validateUpdate,
        validateCreate : validateCreate
    };

}());
