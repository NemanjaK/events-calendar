/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('increments', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    }
  });
};
