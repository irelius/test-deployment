'use strict';

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotImageSeeds = [
  {
    // id: 1,
    spotId: 1,
    url: 'https://example.com/image1.jpg',
    preview: true
  },
  {
    // id: 2,
    spotId: 1,
    url: 'https://example.com/image2.jpg',
    preview: false
  },
  {
    // id: 3,
    spotId: 2,
    url: 'https://example.com/image3.jpg',
    preview: true
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
   await SpotImage.bulkCreate(spotImageSeeds,
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
    // options.tableName = 'SpotImages';
    return queryInterface.bulkDelete('SpotImages', null, { schema: options.schema })
  }
};
