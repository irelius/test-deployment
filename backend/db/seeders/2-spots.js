'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
const { Spot } = require('../models');
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'Spots'

module.exports = {
    async up(queryInterface, Sequelize) {
        await Spot.bulkCreate([
            {
                ownerId: 1,
                address: "1124 Oak Street",
                city: "Sunnydale",
                state: "California",
                country: "USA",
                lat: 40.7128,
                lng: -74.0060,
                name: "Luxury Retreat",
                description: "Escape to luxury in this multi-level modern masterpiece! Located in a se",
                price: 300.00,
            },
            {
                ownerId: 2,
                address: "1690 Highrise Avenue",
                city: "Metropolis",
                state: "New York",
                country: "USA",
                lat: 34.0522,
                lng: -118.2437,
                name: "Skyline View Penthouse",
                description: "Exclusive penthous-n explorers.",
                price: 500.00,
            }
        ], { validate: true })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(options, {}, {})
    }
};
