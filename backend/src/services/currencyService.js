var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var getAll = function(){
        return tables.currency.findAll().then(function (currencies){
            var data = [];

            currencies.forEach(function (currency){
                data.push({
                    id: currency.id,
                    name: currency.name
                });
            });

            return data;
        });
    };

    return {
        getAll : getAll
    };

}());