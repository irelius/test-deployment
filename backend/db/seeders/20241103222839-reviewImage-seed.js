'use strict';

const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviewImageSeeds = [
  {
    // id: 1,
    reviewId: 1,
    url: 'https://example.com/review-image1.jpg'
  },
  {
    // id: 2,
    reviewId: 1,
    url: 'https://example.com/review-image2.jpg'
  },
  {
    // id: 3,
    reviewId: 2,
    url: 'https://example.com/review-image3.jpg'
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
    await ReviewImage.bulkCreate(reviewImageSeeds,
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
    // options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete('ReviewImages', null, { schema: options.schema })
  }
};
