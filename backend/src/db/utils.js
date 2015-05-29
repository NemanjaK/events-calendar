var Sequelize = require("sequelize");
var merge = require("merge");
var sequelize = require("./globals").sequelize;

function insert(table, primaryKey, attributes) {
	var attr = merge(primaryKey, attributes);
	return table.create(attr).then(function(result) {
		return table.find({
			where : primaryKey
		});
	});
}

function bulkInsert(table, arr) {
	return table.bulkCreate(arr);
}

module.exports = {
	insert : insert,
	bulkInsert : bulkInsert
};