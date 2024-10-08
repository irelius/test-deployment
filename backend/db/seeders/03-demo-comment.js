'use strict';
const {Comment} = require('../models');
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
    await Comment.bulkCreate([
      {
        comment:  "DONE IN 30 MINUTES",
        userId:  2, //David Goggins
        bountyId:  1,
      },
      {
        comment:  "I gotta work on my cardio",
        userId:  3, //Samuyil Hyde
        bountyId:  1,
      },
      {
        comment:  "DONE IN 1 DAY",
        userId:  2, //David Goggins
        bountyId:  2,
      },
      {
        comment:  "My cardio D:",
        userId:  3, //Samuyil Hyde
        bountyId:  2,
      },
      {
        comment:  "DONE IN 1 SECOND",
        userId:  2, //David Goggins
        bountyId:  3,
      },
      {
        comment:  "Audiobooked. It counts",
        userId:  3, //Samuyil Hyde
        bountyId:  3,
      },
      {
        comment:  "STAY HARD",
        userId:  1, //Demo
        bountyId:  4,
      },
      {
        comment:  "He can't keep getting away with it",
        userId:  1, //Demo
        bountyId:  5,
      },
      {
        comment:  "I don't remember doing this",
        userId:  3, //Samuyil Hyde
        bountyId:  5,
      },
      {
        comment:  "Needs salt",
        userId:  1, //Demo
        bountyId:  6,
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
    options.tableName = 'Comments';
    // const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};
