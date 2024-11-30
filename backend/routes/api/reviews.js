// backend/routes/api/reviews.js
const express = require('express');
const { User, Review, Spot, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// GET all Reviews of current user 
router.get(
  '/current',
  requireAuth,
  async (req, res) => {
    try {
      const { id } = req.user;

      // Find all reviews by the current user
      const userReviews = await Review.findAll({
        where: { userId: id },
        include: [
          {
            model: User,
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
            ]
          },
          {
            model: ReviewImage,
            attributes: ['id', 'url']
          }
        ]
      });

      res.json(userReviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching user reviews' });
    }
  }
);

// GET all reviews for a specific spot
router.get('/spots/:spotId/reviews', async (req, res) => {
  const { spotId } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this spot' });
    }

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching reviews' });
  }
});

// POST a new review for a spot
router.post(
  '/spots/:spotId/reviews',
  requireAuth,
  [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required.'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5.')
  ],
  async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const { id: userId } = req.user;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({ message: 'Spot not found' });
      }

      const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
      });

      res.status(201).json(newReview);
    } catch (error) {
      console.error('Error creating review:', error); // Detailed error logging
      res.status(500).json({ message: 'An error occurred while creating the review' });
    }
  }
);

// ADD IMAGE TO REVIEW
router.post(
  '/:reviewId/images', 
  requireAuth, 
  async (req, res) => {
    const { id } = req.user;
    const { reviewId } = req.params;
    const { url } = req.body;

    // Check if review exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the owner of the review
    if (review.userId !== Number(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Check if the maximum number of images is reached
    const existingImages = await ReviewImage.count({ 
      where: { reviewId } 
    });
    if (existingImages >= 10) {
      return res.status(400).json({ message: 'Maximum number of images for this review reached' });
    }

    // Add image
    const newImage = await ReviewImage.create({ reviewId, url });
    return res.status(201).json({ 
      id: newImage.id, url: newImage.url 
    });
  }
);

// DELETE IMAGE FROM REVIEW
router.delete(
  '/images/:imageId', 
  requireAuth, 
  async (req, res) => {
    const { id } = req.user;
    const { imageId } = req.params;

    // Find image
    const imageToDelete = await ReviewImage.findByPk(imageId);
    if (!imageToDelete) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user is the owner of the review
    const review = await Review.findByPk(imageToDelete.reviewId);
    if (review.userId !== Number(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Delete image
    await imageToDelete.destroy();
    return res.json({ message: 'Successfully deleted' });
  }
);

// EDIT REVIEW
router.put(
  '/:reviewId',
  requireAuth,
  async (req, res) => {
    const { id } = req.user;
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    // Find review
    const reviewToUpdate = await Review.findByPk(reviewId);
    if (!reviewToUpdate) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the owner of the review
    if (reviewToUpdate.userId !== Number(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Validate review content and stars
    if (!review || review.length < 2 || review.length > 256 || isNaN(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Invalid review content or stars' });
    }

    // Update review
    reviewToUpdate.review = review;
    reviewToUpdate.stars = parseFloat(stars);

    const updatedReview = await reviewToUpdate.save();
    res.json(updatedReview);
  }
);

// DELETE REVIEW
router.delete(
  '/:reviewId', 
  requireAuth, 
  async (req, res) => {
    const { id } = req.user;
    const { reviewId } = req.params;

    // Find review
    const reviewToDelete = await Review.findByPk(reviewId);
    if (!reviewToDelete) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check if user is the owner of the review
    if (reviewToDelete.userId !== Number(id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this review.' });
    }

    // Delete review
    await reviewToDelete.destroy();

    // Update avgRating for spot
    const allReviews = await Review.findAll({ where: { spotId: reviewToDelete.spotId } });
    if (allReviews.length > 0) {
      const sum = allReviews.reduce((acc, el) => acc + el.stars, 0);
      const avgRating = parseFloat((sum / allReviews.length).toFixed(1));

      const spot = await Spot.findByPk(reviewToDelete.spotId);
      spot.avgRating = parseFloat(avgRating);
      await spot.save();
    } else {
      const spot = await Spot.findByPk(reviewToDelete.spotId);
      spot.avgRating = null;
      await spot.save();
    }

    return res.json({ message: 'Successfully deleted' });
  }
);

module.exports = router;