var Promise = require("bluebird");

module.exports = (function () {

    var validateCreateWorker = function(req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.body.firstName) {
            defer.reject({
                message: "Missing or empty attribute [firstName]."
            });
        } else if (!req.body.color) {
            defer.reject({
                message: "Missing or empty attribute [color]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    var validateWorkerId = function(req){
        var defer = Promise.defer();

        if(!req.query) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.query.workerId) {
            defer.reject({
                message: "Missing or empty attribute [workerId]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    return {
        validateWorkerId: validateWorkerId,
        validateCreateWorker : validateCreateWorker
    };

}());
