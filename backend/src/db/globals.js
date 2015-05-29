var dbConfig  = require('./config/config.json');

var Sequelize = require("sequelize");
var utils = require("./utils");

var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
	dialect: dbConfig.engine,
	logging: function () { // do not log
	},
	define: {
		/**
		 * http://stackoverflow.com/questions/14002646/sequelize-for-node-js-er-no-such-table
		 */
		freezeTableName: true,
		timestamps: false
	}
});

var improveColumns = function (def) {
	var prop;
	for (prop in def) {
		if (prop === "id" && def.hasOwnProperty(prop) && def[prop]["allowNull"] === false) {
			def[prop]["primaryKey"] = true;
			def[prop]["unique"] = true;
			def[prop]["autoIncrement"] = true;
			break;
		}
	}
    if(def.created_at){
        delete def.created_at;
    }
    if(def.updated_at){
        delete def.updated_at;
    }
};

var improveModelFunc = function (modelFunc) {
	var myName;
	var myDef;
	var mySequelize = {
		define: function (name, def) {
			myName = name;
			improveColumns(def);
			myDef = def;
		}
	};
	return function (sequelize, DataTypes) {
		var initialModel = modelFunc(mySequelize, DataTypes);
		return sequelize.define(myName, myDef);
	};
};


var tables = {};

// http://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder
// Load `*.js` under current directory as properties
// i.e., `User.js` will become `exports['User']` or `exports.User`
require('fs').readdirSync(__dirname + '/model/').forEach(function (file) {
	if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
		var name = file.replace('.js', '');
		var modelFunc = require('./model/' + file);
		var table = sequelize.import(name, improveModelFunc(modelFunc));
		tables[name] = table;
	}
});

exports.sequelize = sequelize;
exports.tables = tables;


exports = {
	tables : tables,
	sequelize : sequelize,
	utils : utils
};