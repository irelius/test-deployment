'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
const { Review } = require('../models');
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'Reviews'

module.exports = {
    async up(queryInterface, Sequelize) {
        await Review.bulkCreate([
            {
                userId: 1,
                spotId: 2,
                review: "crummy location. rude hosts.",
                stars: 1,
            },
            {
                userId: 1,
                spotId: 4,
                review: "Lovely place for a date.",
                stars: 5
            },
        ], { validate: true })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(options, {}, {})
    }
};
