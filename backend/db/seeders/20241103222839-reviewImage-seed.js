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
    url: 'https://essenziale-hd.com/wp-content/uploads/2020/08/loft_kitchens_118186909_2820081271612439_6383510351478180441_n.jpg'
  },
  {
    // id: 2,
    reviewId: 1,
    url: 'https://leasingkc.com/wp-content/uploads/2018/12/DSC_1290-1024x683.jpg'
  },
  {
    // id: 3,
    reviewId: 2,
    url: 'https://static.wikia.nocookie.net/vgost/images/5/56/Rick_Astley.jpg/revision/latest?cb=20220705002743'
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
