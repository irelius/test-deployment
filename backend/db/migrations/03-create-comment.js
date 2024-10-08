'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.STRING(300)
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {model: "Users", key: "id"}
      },
      bountyId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Bounties", 
          key: "id", 
          onDelete: "CASCADE"}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Comments";
    return queryInterface.dropTable(options);
  }
};