'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const bookingSeeds = [
  {
    // id: 1,
    spotId: 1,
    userId: 1,
    startDate: '2024-11-05',
    endDate: '2024-11-10'
  },
  {
    // id: 2,
    spotId: 2,
    userId: 1,
    startDate: '2024-12-10',
    endDate: '2024-12-15'
  },
  {
    // id: 3,
    spotId: 3,
    userId: 2,
    startDate: '2024-11-20',
    endDate: '2024-11-25'
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
    await Booking.bulkCreate(bookingSeeds,
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
    // options.tableName = 'Bookings';
    return queryInterface.bulkDelete('Bookings', null, { schema: options.schema })
  }
};
