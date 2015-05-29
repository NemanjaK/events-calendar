var Promise = require("bluebird");

module.exports = (function () {


    var validateReorder = function (req){
        var defer = Promise.defer();

        if(!req.body) {
            defer.reject({
                message: "No data sent."
            });
        } else if (req.body.constructor !== Array) {
            defer.reject({
                message: "Attribute must be instance of []."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;
    };

    var validateStartEndDate = function (req){
        var defer = Promise.defer();

        if(!req.query) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.query.start) {
            defer.reject({
                message: "Missing or empty attribute [start]."
            });
        } else if (!req.query.end) {
            defer.reject({
                message: "Missing or empty attribute [end]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;
    };



    var validateFilterCategory = function (req){
        var defer = Promise.defer();

        if(!req.query) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.query.filterCategory) {
            defer.reject({
                message: "Missing or empty attribute [filterCategory]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;
    };

    var validateSearch = function (req){
        var defer = Promise.defer();

        if(!req.query) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.query.search) {
            defer.reject({
                message: "Missing or empty attribute [search]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;
    };

    var validateLimitOffset = function (req){
        var defer = Promise.defer();

        if(!req.query) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.query.limit) {
            defer.reject({
                message: "Missing or empty attribute [limit]."
            });
        }  else if (!req.query.offset) {
            defer.reject({
                message: "Missing or empty attribute [offset]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;
    };

    var validateId = function (req){
        var defer = Promise.defer();

        if(!req.query) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.query.id) {
            defer.reject({
                message: "Missing or empty attribute [id]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;
    };

    var validateDate = function (req){
        var defer = Promise.defer();

        if(!req.query) {
            defer.reject({
                message: "No data sent."
            });
        } else if (!req.query.date) {
            defer.reject({
                message: "Missing or empty attribute [date]."
            });
        } else {
            defer.resolve();
        }

        return defer.promise;
    };

    return {
        validateId: validateId,
        validateDate: validateDate,
        validateSearch: validateSearch,
        validateReorder: validateReorder,
        validateLimitOffset: validateLimitOffset,
        validateStartEndDate: validateStartEndDate,
        validateFilterCategory: validateFilterCategory
    };

}());
