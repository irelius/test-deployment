// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

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

//Get Reviews of current user
router.get(
  '/users/:userId/reviews',
  requireAuth,
  async (req, res) => {
    const userReviews = await Review.findAll({ where: { userId: req.params.userId }});

    if (!userReviews) {
      return res.status(400).json({ message: 'No reviews found for this user' });
    }

    return res.json({ reviews: userReviews })
  }
)



// Sign up
router.post(
    '/users/new',   //path
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
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
  
      return res.json({ user: safeUser });
    }
  );

//Get User Id
router.get('/users/:userId', requireAuth, async (req, res) => {
  const user = await User.findByPk(req.params.userId, {
    attributes: { exclude: ['hashedPassword']}
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
})



  // Login
router.post(
  '/users/login',  
  async (req, res) => {
  const { credential, password } = req.body;   
  const user = await User.findOne({ where: { credential } });  

  if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
    return res.status(401).json({ message: 'Invalid user name or password'});
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
