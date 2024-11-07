// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
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

//Get Reviews of current user
router.get(
  '/:userId/reviews',
  // requireAuth,
  async (req, res) => {
    try{
    const userReviews = await Review.findAll({ 
      where: { userId: req.params.userId },
      include: [
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          // as: 'Spot',
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']
        },
        {
          model: ReviewImage,
          // as: 'ReviewImages',
          attributes: ['id', 'url']
        }
      ]
    });

    if (!userReviews || userReviews.length === 0) {
      return res.status(400).json({ message: 'No reviews found for this user' });
    }
    const formattedReviews = userReviews.map(review => ({
      ...review.toJSON(), 
      createdAt: format(new Date(review.createdAt), "yyyy-MM-dd HH:mm:ss"),
      updatedAt: format(new Date(review.updatedAt), "yyyy-MM-dd HH:mm:ss"),
    }));

    return res.json({ reviews: formattedReviews })
  }catch (error) {
    return res.status(500).json({ message: 'An error occurred', error });
  }
}
)



// Sign up
router.post(
    '/signup',   
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      
      const existingUser = await User.findOne({
        where: { email },
      }) || await User.findOne({
        where: { username },
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
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.status(201).json({ user: safeUser });
    }
  );

//Get User Id
router.get(
  '/:userId', 
  // requireAuth, 
  async (req, res) => {
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



  // Login
router.post(
  '/login',  
  async (req, res) => {
  const { credential, password } = req.body;   
  const user = await User.findOne({ 
    where: { [Op.or]: [{ email: credential }, { username: credential }] },
    attributes: 
      ['id', 'firstName', 'lastName', 'email', 'username', 'hashedPassword']
    
  });  

  if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
    return res.status(401).json({ message: 'Invalid credentials'});
  }

  const safeUser = {
    id: user.id, 
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email, 
    username: user.username };

  await setTokenCookie(res, safeUser);

  return res.json({ user: safeUser });

});

module.exports = router;
