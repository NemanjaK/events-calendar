/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('worker', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    salon_id: {
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
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    order: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_account_id: {
      type: DataTypes.INTEGER(11),
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
