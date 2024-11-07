// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models'); 
const { Review } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { format } = require('date-fns');
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

// GET all Reviews of current user by userId
router.get(
  '/:userId/reviews',
  // requireAuth,
  async (req, res) => {
    try{
      const { userId } = req.params;

      // Find all reviews by the current user
      const userReviews = await Review.findAll({
        where: { userId },
        include: [
          {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: Spot,
            attributes: [
              'id',
              'ownerId',
              'address',
              'city',
              'state',
              'country',
              'lat',
              'lng',
              'name',
              'price',
              'previewImage'
            ]
          },
          {
            model: ReviewImage,
            attributes: ['id', 'url']
        }
      ]
    });

    if (!userReviews || userReviews.length === 0) {
      return res.status(400).json({ message: 'No reviews found for this user' });
    }
    const formattedReviews = userReviews.map(review => ({
      ...review.toJSON(), 
      createdAt: review.createdAt.toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: review.updatedAt.toISOString().replace('T', ' ').slice(0, 19)
    }));

    return res.json({ reviews: formattedReviews })
  }catch (error) {
    return res.status(500).json({ message: 'An error occurred', error });
  }
}
)


// POST (create) a new User
router.post(
    '/signup',   
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      
      if (!firstName || !LastName || !email || !username || !password) {
        return res.status(400).json({
          message: "Bad Request",
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
      }
      
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
      await setTokenCookie(res, newUser);
    
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

// GET detail of a User based on userId
router.get(
  '/:userId', 
  //requireAuth, 
  //restoreUser,
  async (req, res) => {
    if (!req.user) {
      return res.status(200).json({ user:null });
    }

    const user = await User.findByPk(req.params.userId, {
    attributes: { 
      exclude: ['hashedPassword'],
      include: ['id', 'firstName', 'lastName', 'email']
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user });
})



// POST to Login
router.post(
  '/login',  
  async (req, res) => {
  const { credential, password } = req.body;   

    if (!credential || password) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          credential: "Email or username is required",
          password: "Password is required"
        }
      });
    }

  const user = await User.findOne({ 
    where: 
    { [Op.or]: {
      username: credential,
      email: credential
    }
   }
    // attributes: 
    //   ['id', 'firstName', 'lastName', 'email', 'username', 'hashedPassword']
    
  });  

  if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
    return res.status(401).json({ message: 'Invalid credentials'});
  }

  //const safeUser = {
  setTokenCookie(res, user);
  return res.status(200).json({
    user:{
    id: user.id, 
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email, 
    username: user.username 
     }
  });
 }
);

module.exports = router;
