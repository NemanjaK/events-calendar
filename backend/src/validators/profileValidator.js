var Promise = require("bluebird");

module.exports = (function () {

    var validate = function(req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.body.workingDays) {
            defer.reject({
                message: "Missing attribute."
            });
        } else if (req.body.workingDays.constructor !== Array) {
            defer.reject({
                message: "Attribute must be instance of []."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    return {
        validate : validate
    };

}());
