/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salon_member', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    user_account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    salon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  });
};
