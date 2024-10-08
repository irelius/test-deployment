'use strict';
const {CompletedBounty} = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await CompletedBounty.bulkCreate([
      {
        userId:  1,
        bountyId:  1,
        completed: true,
      },
      {
        userId:  2,
        bountyId:  1,
        completed: true,
      },
      {
        userId:  3,
        bountyId:  1,
        completed: true,
      },
      {
        userId:  1,
        bountyId:  2,
        completed: true,
      },
      {
        userId:  2,
        bountyId:  2,
        completed: true,
      },
      {
        userId:  3,
        bountyId:  2,
        completed: true,
      },
      {
        userId:  1,
        bountyId:  3,
        completed: true,
      },
      {
        userId:  2,
        bountyId:  3,
        completed: true,
      },
      {
        userId:  1,
        bountyId:  4,
        completed: true,
      },
      {
        userId:  2,
        bountyId:  5,
        completed: true,
      },
      {
        userId:  3,
        bountyId:  5,
        completed: true,
      },
      {
        userId:  1,
        bountyId:  6,
        completed: true,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'CompletedBounties';
    // const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};
