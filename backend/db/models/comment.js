'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {foreignKey: "userId"}),
      Comment.belongsTo(models.Bounty, {foreignKey: "bountyId", onDelete: "CASCADE"})
    }
  }
  Comment.init({
    comment: {
      type:DataTypes.STRING(300) 
    },
    userId: DataTypes.INTEGER,
    bountyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};