var Promise = require("bluebird");

module.exports = (function () {

    var validateCreateMaterial = function(req){
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
        } else if (!req.body.unit) {
            defer.reject({
                message: "Missing or empty attribute [unit]."
            });
        } else if (!req.body.price) {
            defer.reject({
                message: "Missing or empty attribute [price]."
            });
        } else if (!req.body.quantity) {
            defer.reject({
                message: "Missing or empty attribute [quantity]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    return {
        validateCreateMaterial : validateCreateMaterial
    };

}());
