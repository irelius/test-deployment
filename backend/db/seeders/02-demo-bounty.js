'use strict';
const {Bounty} = require('../models');
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
    await Bounty.bulkCreate([
      { //id = 1
        title:  "Run 10 kilometer",
        description:  "Run 10 kilometers. Do so in under 3 hours.",
        userId:  1,
      },
      { //id = 2
        title:  "Do 5000 pushups in 1 week",
        description:  "YOU HAVE TO SHOCK THE MUSCLE",
        userId:  1,
      },
      { //id = 3
        title:  "Read a book in 1 week",
        description:  "The book must be no fewer than 300 pages.",
        userId:  1,
      },
      { //id = 4
        title:  "Do 200 pullups in 1 day",
        description:  "WHO'S GOING TO CARRY THE BOATS",
        userId:  2,
      },
      { //id = 5
        title:  "Squat 225 below parallel",
        description:  "I'll remove the copyright claim if you can squat 225 below parallel",
        userId:  3,
      },
      { //id = 6
        title:  "Eat a raw liver",
        description:  "The secret to health is raw liver and paleo",
        userId:  4,
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bounties';
    // const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};
