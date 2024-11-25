// seeders/20241103222759-spot-seed.js

'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

const spotSeeds = [
  {
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
    previewImage: 'https://example.com/image1.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
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
    previewImage: '../spotImages/SanFrancisco/sanfran.jpeg', 
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
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
    previewImage: 'https://example.com/image3.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: 2,
    address: '123 Ocean Ave',
    city: 'Santa Monica',
    state: 'CA',
    country: 'USA',
    lat: 34.0195,
    lng: -118.4912,
    name: 'Beachfront House in Santa Monica',
    description: 'A beautiful house right on the beach in Santa Monica.',
    price: 500,
    avgRating: 4.9,
    previewImage: 'https://example.com/image4.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: 3,
    address: '456 Mountain Rd',
    city: 'Aspen',
    state: 'CO',
    country: 'USA',
    lat: 39.1911,
    lng: -106.8175,
    name: 'Mountain Cabin in Aspen',
    description: 'A cozy cabin in the mountains of Aspen.',
    price: 300,
    avgRating: 4.7,
    previewImage: 'https://example.com/image5.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: 2,
    address: '789 City St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    lat: 40.7128,
    lng: -74.0060,
    name: 'Luxury Apartment in New York',
    description: 'A luxurious apartment in the heart of New York City.',
    price: 600,
    avgRating: 4.9,
    previewImage: 'https://example.com/image6.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: 2,
    address: '123 Desert Rd',
    city: 'Phoenix',
    state: 'AZ',
    country: 'USA',
    lat: 33.4484,
    lng: -112.0740,
    name: 'Desert Villa in Phoenix',
    description: 'A stunning villa in the desert of Phoenix.',
    price: 350,
    avgRating: 4.6,
    previewImage: 'https://example.com/image7.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: 1,
    address: '789 Mountain Rd',
    city: 'Big Sky',
    state: 'MT',
    country: 'USA',
    lat: 45.2611,
    lng: -111.3080,
    name: 'Mountain Retreat in Big Sky',
    description: 'A beautiful mountain retreat in Big Sky, Montana.',
    price: 450,
    avgRating: 4.9,
    previewImage: '../spotImages/BigSky/bigsky.jpeg', 
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: 1,
    address: '789 Forest Rd',
    city: 'Portland',
    state: 'OR',
    country: 'USA',
    lat: 45.5152,
    lng: -122.6784,
    name: 'Forest Retreat in Portland',
    description: 'A peaceful retreat in the forests of Portland.',
    price: 275,
    avgRating: 4.7,
    previewImage: 'https://example.com/image9.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate(spotSeeds, {
      schema: options.schema,
      validate: true
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Spots', null, { schema: options.schema });
  }
};