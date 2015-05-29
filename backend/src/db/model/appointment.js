/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('appointment', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    salon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    rawData: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    discount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true,
    },
    end: {
      type: DataTypes.DECIMAL(4,2),
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
