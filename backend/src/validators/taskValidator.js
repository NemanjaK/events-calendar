var Promise = require("bluebird");

module.exports = (function () {

    var validateUpdate = function(req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.body.taskId) {
            defer.reject({
                message: "Missing or empty attribute [taskId]."
            });
        } else if (!req.body.workerId) {
            defer.reject({
                message: "Missing or empty attribute [workerId]."
            });
        } else if (!req.body.appointmentId) {
            defer.reject({
                message: "Missing or empty attribute [appointmentId]."
            });
        } else {
            defer.resolve();
        }
        return defer.promise;
    };



    return {
        validateUpdate: validateUpdate
    };

}());
