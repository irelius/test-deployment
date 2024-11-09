'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotSeeds = [
  {
    // id: 1,
    ownerId: 1,
    address: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    lat: 34.0522,
    lng: -118.2437,
    name: 'Cozy Apartment in LA',
    description: 'A lovely apartment located in the heart of Los Angeles.',
    price: 150,
    avgRating: 4.5,
    previewImage: 'https://example.com/image1.jpg'
  },
  {
    // id: 2,
    ownerId: 2,
    address: '456 Oak Ave',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    lat: 37.7749,
    lng: -122.4194,
    name: 'Charming Cottage in SF',
    description: 'A quaint cottage with beautiful views of the city.',
    price: 200,
    avgRating: 4.7,
    previewImage: 'https://example.com/image2.jpg'
  },
  {
    // id: 3,
    ownerId: 1,
    address: '789 Pine Rd',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    lat: 47.6062,
    lng: -122.3321,
    name: 'Modern Condo in Seattle',
    description: 'A sleek condo in the downtown area of Seattle.',
    price: 250,
    avgRating: 4.8,
    previewImage: 'https://example.com/image3.jpg'
  }
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
    await Spot.bulkCreate(spotSeeds,
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
    // options.tableName = 'Spots';
    return queryInterface.bulkDelete('Spots', null, { schema: options.schema })
  }
};
