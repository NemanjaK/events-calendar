/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('material_order_by', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('NAME','CNT','ORDER'),
      allowNull: true,
    },
    salon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    updated_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
