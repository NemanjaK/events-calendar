var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {


    var saveOrderBy = function (userId, salonId, sort){
        var data = {
            type: sort.type,
            updated_by: userId
        };
        return tables.material_order_by.find({
            where: {
                salon_id: salonId
            }
        }).then(function (s){
            return s.updateAttributes(data);
        });
    };

    var getOrderBy = function(salonId){
        return tables.material_order_by.find({
            where: {
                salon_id: salonId
            }
        }).then(function (data){
            return data? data.type : data;
        });
    };

    var getAll = function(salonId){
        return tables.material.findAll({
            where: {
                salon_id: salonId,
                is_deleted: false
            }
        }).then(function (data){
            var materials = [];
            data.forEach(function (material) {
                materials.push({
                    id: material.id,
                    name : material.name,
                    unit : material.unit,
                    price : material.price,
                    quantity : material.quantity,
                    order : material.order,
                    cnt : material.cnt
                });
            });
            return materials;
        });
    };

    var history = function(salonId){
        return tables.material.findAll({
            where: {
                salon_id: salonId
            }
        }).then(function (data){
            var materials = [];
            data.forEach(function (material) {
                materials.push({
                    id: material.id,
                    name : material.name,
                    unit : material.unit,
                    price : material.price,
                    quantity : material.quantity,
                    order : material.order,
                    cnt : material.cnt
                });
            });
            return materials;
        });
    };

    var create = function (userId, salonId, material){
        var data = {
            name : material.name,
            unit : material.unit,
            price : material.price,
            quantity : material.quantity,
            order : material.order,
            cnt : 0,
            is_deleted: false,
            salon_id : salonId,
            created_by: userId,
            updated_by: userId
        };
        return tables.material.create(data).then(function (response) {
            return response.id;
        });
    };

    var update = function (userId, salonId, material){
        var data = {
            name : material.name,
            unit : material.unit,
            price : material.price,
            quantity : material.quantity,
            order : material.order,
            updated_by: userId
        };

        return tables.material.find({
            where: {
                id: material.id,
                salon_id: salonId
            }
        }).then(function (m){
            return m.updateAttributes(data).then(function (){
                return m.id;
            });
        });
    };

    var remove = function (userId, salonId, material){
        var data = {
            is_deleted: true,
            updated_by: userId
        };
        return tables.material.find({
            where: {
                id: material.id,
                salon_id: salonId
            }
        }).then(function (m){
            return m.updateAttributes(data).then(function (){
                return m.id;
            });
        });
    };


    var reorder = function (userId, salonId, materials) {
        return tables.material.findAll({
            where: {
                salon_id: salonId,
                is_deleted: false
            }
        }).then(function (dbMaterials){
            var promises = [];
            materials.forEach(function (material){
                dbMaterials.forEach(function (dbMaterial){
                    if(material.id == dbMaterial.id && material.order != dbMaterial.order){
                        promises.push(dbMaterial.updateAttributes({
                            order : material.order,
                            updated_by: userId
                        }));
                    }
                });
            });

            return Promise.props({
                all: promises
            });
        });
    };

    var incDecCnt = function (oldMaterials, newMaterials, t){
        var oldIds  = [];
        var newIds = [];

        oldMaterials.forEach(function (material){
            oldIds.push(material.materialId);
        });

        newMaterials.forEach(function (material){
            newIds.push(material.id);
        });
        //console.log('0:', oldIds);
        //console.log('n:', newIds);

        var ids = oldIds.filter(function(i) {
            return newIds.indexOf(i) < 0;
        }).concat(newIds.filter(function(i) {
            return oldIds.indexOf(i) < 0;
        }));

        //console.log('material diff:', ids);

        return tables.material.findAll({
            where: {
                id: ids
            },
            transaction: t
        }).then(function (dbMaterials){
            var promises = [];
            dbMaterials.forEach(function (dbMaterial){
                newIds.forEach(function (id){
                    if(id == dbMaterial.id){
                        promises.push(dbMaterial.increment('cnt'));
                    }
                });
            });

            dbMaterials.forEach(function (dbMaterial){
                oldIds.forEach(function (id){
                    if(id == dbMaterial.id){
                        promises.push(dbMaterial.decrement('cnt'));
                    }
                });
            });

            return Promise.props({
                all: promises
            });

        });
    };

    return {
        getAll: getAll,
        remove: remove,
        create: create,
        update: update,
        history: history,
        reorder: reorder,
        incDecCnt: incDecCnt,
        getOrderBy: getOrderBy,
        saveOrderBy: saveOrderBy
    };

}());

