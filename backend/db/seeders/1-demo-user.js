'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Users';

module.exports = {
    async up(queryInterface, Sequelize) {
        await User.bulkCreate([
            {
                email: 'demo@user.io',
                username: 'Demo-lition',
                hashedPassword: bcrypt.hashSync('password')
            },
            {
                email: 'user1@user.io',
                username: 'FakeUser1',
                hashedPassword: bcrypt.hashSync('password2')
            },
            {
                email: 'user2@user.io',
                username: 'FakeUser2',
                hashedPassword: bcrypt.hashSync('password3')
            }
        ], { validate: true });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(options, {}, {})
    }
};
