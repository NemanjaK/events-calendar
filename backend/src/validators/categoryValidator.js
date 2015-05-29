var Promise = require("bluebird");

module.exports = (function () {

    var validateCreateCategory = function(req){
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
        } else if (!req.body.color) {
            defer.reject({
                message: "Missing or empty attribute [color]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    return {
        validateCreateCategory : validateCreateCategory
    };

}());
