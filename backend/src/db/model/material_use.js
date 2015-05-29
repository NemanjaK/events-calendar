/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('material_use', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    material_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    appointment_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  });
};
