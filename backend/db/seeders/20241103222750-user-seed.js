'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const userSeeds = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    hashedPassword: bcrypt.hashSync('password1')
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    hashedPassword: bcrypt.hashSync('password2')
  },
  {
    id: 3,
    firstName: 'Sam',
    lastName: 'Brown',
    email: 'sam.brown@example.com',
    username: 'sambrown',
    hashedPassword: bcrypt.hashSync('password3')
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', userSeeds,
      { validate: true,
        schema: options.schema
      });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['johndoe', 'janesmith', 'sambrown']
      }
    }, { schema: options.schema })
  }
};
