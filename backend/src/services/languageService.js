var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var getAll = function(){
        return tables.language.findAll().then(function (currencies){
            var data = [];

            currencies.forEach(function (lang){
                data.push({
                    id: lang.id,
                    name: lang.name
                });
            });

            return data;
        });
    };

    return {
        getAll : getAll
    };

}());