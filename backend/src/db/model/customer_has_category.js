/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer_has_category', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
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
