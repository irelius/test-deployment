'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompletedBounty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CompletedBounty.belongsTo(models.Bounty, {foreignKey: "bountyId", onDelete: "CASCADE"}), //Might have to include onDelete:"CASCADE"
      CompletedBounty.belongsTo(models.User, {foreignKey: "userId"})
    }
  }
  CompletedBounty.init({
    userId: DataTypes.INTEGER,
    bountyId: DataTypes.INTEGER,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'CompletedBounty',
  });
  return CompletedBounty;
};