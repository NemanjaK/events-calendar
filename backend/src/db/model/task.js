/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('task', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    base_task_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    worker_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    appointment_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    start: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true,
    },
    end: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true,
    },
    pause: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true,
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
