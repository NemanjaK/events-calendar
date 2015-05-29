/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('material', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM('NONE','G','ML'),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    cnt: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
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
