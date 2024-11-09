const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spots.js');
const reviewRouter = require('./reviews.js');
const bookingRouter = require('./bookings.js')
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
  router.use(restoreUser);

  router.get('/test', requireAuth, (req, res) => {
    res.json ({ message: 'success' })
  });

  
// DELETE a Spot Image
router.delete('/spot-images/:imageId',
  requireAuth,
  async (req, res) => {
      const { id } = req.user;
      const { imageId } = req.params;

      try {
          const spot = await Spot.findOne({
              where: { ownerId: Number(id) }
          })
          if (!spot || spot.length <= 0) {
              return res.status(400).json({ message: "The Spot doesn't belong to the User" })
          }

          const imageBySpot = await SpotImage.findOne({
              where: { id: imageId, spotId: spot.id }
          });

          if (imageBySpot) {
              await imageBySpot.destroy();
              return res.status(200).json({ message: "Successfully deleted" });
          } else {
              return res.status(404).json({ message: "Spot Image couldn't be found" })
          }
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "An error occurred while deleting the image" })
      }
  }
)

//DELETE IMAGE FROM REVIEW:
router.delete(
  '/review-images/:imageId',
  requireAuth,
  async (req, res) => {
      const { id } = req.user;
      const { imageId } = req.params;


      //find image
      const reviewImage = await ReviewImage.findByPk(imageId);
      if (!reviewImage) {
          return res.status(404).json({ message: 'Review image not found' });
      }
      //exist
      const review = await Review.findByPk(reviewImage.reviewId);
      if(!review) {
          return res.status(404).json({ message: 'Review not found' });
      }
      //user/owner check
      if (review.userId !== Number(id)) {
          return res.status(403).json({ message: 'You are not authorized to delete this image' });
      }
      //delete
      await reviewImage.destroy();

      return res.json({ message: 'Review image deleted successfully' });
  });

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