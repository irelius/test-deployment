'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviewSeeds = [
  {
    // id: 1,
    userId: 2,
    spotId: 1,
    review: 'Had a fantastic experience! Highly recommend this spot.',
    stars: 5
  },
  {
    // id: 2,
    userId: 3,
    spotId: 1,
    review: 'It was okay, but could be improved.',
    stars: 3
  },
  {
    // id: 3,
    userId: 3,
    spotId: 2,
    review: 'Loved it! Will definitely come back.',
    stars: 4
  },
];

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
    await Review.bulkCreate(reviewSeeds,
      { schema: options.schema,
        validate: true
      });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // options.tableName = 'Reviews';
    return queryInterface.bulkDelete('Reviews', null, { schema: options.schema })
  }
};
