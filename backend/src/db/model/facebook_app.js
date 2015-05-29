/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('facebook_app', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    app_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_secret: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
