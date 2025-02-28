const express = require('express');
const { User, Review, Spot, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.get(
  '/current',
  requireAuth,
  async (req, res) => {
    try {
      const { id } = req.user;

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

      res.json({ reviews: userReviews });
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
      return res.json([]);
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

      const existingReview = await Review.findOne({
        where: { userId, spotId },
      });

      if (existingReview) {
        return res.status(400).json({ message: 'User already has a review for this spot' });
      }

      const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
      });

      const createdReview = await Review.findByPk(newReview.id, {
        include: [
          { model: User, attributes: ['id', 'firstName', 'lastName'] },
          { model: ReviewImage, attributes: ['id', 'url'] },
        ],
      });

      res.status(201).json(createdReview);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: 'An error occurred while creating the review' });
    }
  }
);

// GET REVIEW BY reviewId
router.get('/:reviewId', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { reviewId } = req.params;

  try {
    const review = await Review.findByPk(reviewId, {
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

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== Number(id)) {
      return res.status(403).json({ message: "You are not authorized to view this review" });
    }

    const formattedCreatedAt = review.createdAt.toISOString().replace('T', ' ').slice(0, 19);
    const formattedUpdatedAt = review.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

    const formattedReview = {
      ...review.toJSON(),
      stars: parseFloat(review.stars),
      createdAt: formattedCreatedAt,
      updatedAt: formattedUpdatedAt
    };

    return res.status(200).json(formattedReview);
  } catch (error) {
    console.error('Error fetching review:', error);
    return res.status(500).json({ message: 'An error occurred while fetching the review' });
  }
});

// ADD IMAGE TO REVIEW
router.post(
  '/:reviewId/images', 
  requireAuth, 
  async (req, res) => {
    const { id } = req.user;
    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== Number(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const existingImages = await ReviewImage.count({ 
      where: { reviewId } 
    });
    if (existingImages >= 10) {
      return res.status(400).json({ message: 'Maximum number of images for this review reached' });
    }

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

    const imageToDelete = await ReviewImage.findByPk(imageId);
    if (!imageToDelete) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const review = await Review.findByPk(imageToDelete.reviewId);
    if (review.userId !== Number(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

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

    const reviewToUpdate = await Review.findByPk(reviewId);
    if (!reviewToUpdate) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (reviewToUpdate.userId !== Number(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!review || review.length < 2 || review.length > 256 || isNaN(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Invalid review content or stars' });
    }

    reviewToUpdate.review = review;
    reviewToUpdate.stars = parseFloat(stars);

    const updatedReview = await reviewToUpdate.save();

    // Recalculate the average rating for the spot
    const spot = await Spot.findByPk(reviewToUpdate.spotId);
    const reviews = await Review.findAll({ where: { spotId: spot.id } });
    const avgRating = reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length;
    spot.avgRating = avgRating;
    await spot.save();

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

    const reviewToDelete = await Review.findByPk(reviewId);
    if (!reviewToDelete) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (reviewToDelete.userId !== Number(id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this review.' });
    }

    await reviewToDelete.destroy();

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