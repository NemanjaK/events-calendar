var Promise = require("bluebird");
var tables = require("../db/globals").tables;
var sequelize = require("../db/globals").sequelize;


module.exports = (function () {

    var create = function (appointmentId, materials, t){
        var data = [];
        materials.forEach(function(material){
            data.push({
                appointment_id: appointmentId,
                material_id: material.id
            });
        });

        return tables.material_use.bulkCreate(data, {
            transaction: t
        });
    };

    var update = function (appointmentId, materials, t){
        return tables.material_use.destroy({
            appointment_id: appointmentId
        }, {
            transaction: t
        }).then(function (){
            return create(appointmentId, materials, t);
        })
    };

    var get = function (appointmentId, t){
        return tables.material_use.findAll({
            where: {
                appointment_id : appointmentId
            },
            transaction: t
        }).then(function (dbMaterials){
            var materials = [];
            dbMaterials.forEach(function(dbMaterial){
                materials.push({
                    id: dbMaterial.id,
                    materialId: dbMaterial.material_id
                });
            });
            return materials;
        });
    };


    var getMaterialsForIds = function (appointmentIds, t){
        return tables.material_use.findAll({
            where: {
                appointment_id : appointmentIds
            },
            transaction: t
        }).then(function (dbMaterials){
            var materials = [];
            dbMaterials.forEach(function(dbMaterial){
                materials.push({
                    id: dbMaterial.id,
                    appointmentId: dbMaterial.appointment_id,
                    materialId: dbMaterial.material_id
                });
            });
            return materials;
        });
    };

    return {
        get: get,
        create: create,
        update: update,
        getMaterialsForIds: getMaterialsForIds
    };

}());

