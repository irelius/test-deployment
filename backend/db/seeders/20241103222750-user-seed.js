'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const userSeeds = [
  {
    //user ID 1
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    hashedPassword: bcrypt.hashSync('password1')
  },
  {
     //user ID 2
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    hashedPassword: bcrypt.hashSync('password2')
  },
  {
     //user ID 3
    firstName: 'Sam',
    lastName: 'Brown',
    email: 'sam.brown@example.com',
    username: 'sambrown',
    hashedPassword: bcrypt.hashSync('password3')
  },
  {
     //user ID 4
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@user.com',
    username: 'demouser',
    hashedPassword: bcrypt.hashSync('password')
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate(userSeeds, {
      schema: options.schema,
      validate: true
    });
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: {
        [Op.in]: ['johndoe', 'janesmith', 'sambrown', 'demouser']
      }
    }, { schema: options.schema });
  }
};