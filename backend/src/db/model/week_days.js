/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('week_days', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    start: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    end: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    off: {
      type: DataTypes.BOOLEAN,
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
