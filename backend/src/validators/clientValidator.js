var Promise = require("bluebird");

module.exports = (function () {

    var validateCreateClient = function(req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.body.firstName) {
            defer.reject({
                message: "Missing or empty attribute [firstName]."
            });
        } else if (!req.body.lastName) {
            defer.reject({
                message: "Missing or empty attribute [lastName]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    var validateFindClient = function(req){
        var defer = Promise.defer();

        if(!req.query) {
            defer.reject({
                message: "No data sent."
            });
        } else if (req.query.search === undefined) {
            defer.reject({
                message: "Missing or empty attribute [search]."
            });
        } else if (!req.query.offset) {
            defer.reject({
                message: "Missing or empty attribute [offset]."
            });
        } else if (!req.query.limit) {
            defer.reject({
                message: "Missing or empty attribute [limit]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    var validateGetAllClient = function(req){
        var defer = Promise.defer();

        if(!req.query) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.query.offset) {
            defer.reject({
                message: "Missing or empty attribute [offset]."
            });
        } else if (!req.query.limit) {
            defer.reject({
                message: "Missing or empty attribute [limit]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;

    };

    return {
        validateFindClient: validateFindClient,
        validateGetAllClient: validateGetAllClient,
        validateCreateClient : validateCreateClient
    };

}());
