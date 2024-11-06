// backend/routes/api/reviews.js
const express = require('express');

const router = express.Router();

const { format } = require('date-fns');
const { Review, ReviewImage } = require('../../db/models');  //import models
const { requireAuth } = require('../../utils/auth');   //auth middleware

//Add image to a review
router.post(
    '/:reviewId/images', 
    requireAuth, 
    async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body   //!image url passed in the body?

    const review = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

//Check if current user is the owner of review
if (review.userId !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to add an image to this review'
    });
}

const existingImages = await ReviewImage


})



module.exports = router;