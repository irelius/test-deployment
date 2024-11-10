// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models'); 

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.'),
    handleValidationErrors
]


// GET detail of a User based on userId
router.get(
  '/:userId', 
  requireAuth, 
  async (req, res) => {
    if (!req.user) {
      return res.status(200).json({ user: null });
    }

    const user = await User.findByPk(req.params.userId, {
    attributes: { 
      exclude: ['hashedPassword'],
      include: ['id', 'firstName', 'lastName', 'username', 'email']
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const reorderedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,       
    username: user.username  
  };

  return res.status(200).json({ user: reorderedUser });
})

// POST (create) a new User = sign-up
router.post(
  '/',   
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({
        message: "Bad Request.",
        errors: {
          firstName: "First name is required",
          lastName: "Last name is required",
          email: "Email is required",
          username: "Username is required",
          password: "Password is required"
        }
      })
    }

    const existingUser = await User.findOne({
      where: { 
        [Op.or]: [
          { email },
          { username } 
        ]
      }
    });
   
    if (existingUser) {
      return res.status(500).json({ 
        message: "User already exists",
        errors: {
          email: "User with that email already exists",
          username: "User with that username already exists"
        } 
      });
    };
    
    const hashedPassword = bcrypt.hashSync(password);

//create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      hashedPassword
    });

//cookie and resp w/ data

    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    };
    await setTokenCookie(res, safeUser);
  
    return res.status(201).json({
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username
      }
    });
  });


module.exports = router;
