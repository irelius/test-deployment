const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spots.js');
const reviewRouter = require('./reviews.js');
const bookingRouter = require('./bookings.js')
const { restoreUser, requireAuth } = require('../../utils/auth.js');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
  router.use(restoreUser);

  router.get('/test', requireAuth, (req, res) => {
    res.json ({ message: 'success' })
  })

  router.use('/session', sessionRouter);    // to login and logout into the session
  router.use('/users', usersRouter);
  router.use('/spots', spotRouter);
  router.use('/reviews', reviewRouter);
  router.use('/bookings', bookingRouter);
  
  router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
  });




// below codes were for testing on the authenticate-me phase 3
/*
router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

// GET /api/require-auth
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);
*/

module.exports = router;