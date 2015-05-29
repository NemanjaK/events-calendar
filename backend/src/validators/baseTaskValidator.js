var Promise = require("bluebird");

module.exports = (function () {

    var validateCreateBaseTask = function(req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.body.name) {
            defer.reject({
                message: "Missing or empty attribute [name]."
            });
        } else if (req.body.order == undefined) {
            defer.reject({
                message: "Missing or empty attribute [order]."
            });
        } else if (!req.body.duration) {
            defer.reject({
                message: "Missing or empty attribute [duration]."
            });
        } else if (!req.body.price) {
            defer.reject({
                message: "Missing or empty attribute [price]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    return {
        validateCreateBaseTask : validateCreateBaseTask
    };

}());
