// backend/routes/api/reviews.js
const express = require('express');

const router = express.Router();

const { format } = require('date-fns');
const { Review, Spot, ReviewImage } = require('../../db/models');  //import models
const { requireAuth } = require('../../utils/auth');   //auth middleware

//DELETE IMAGE FROM REVIEW:
router.delete(
    '/:reviewId/images/:imageId/users/:userId',
    requireAuth,
    async (req, res) => {
        const { reviewId, imageId, userId } = req.params;

        //exist
        const review = await Review.findByPk(reviewId);
        if(!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        //find image
        const reviewImage = await ReviewImage.findByPk(imageId);
        if (!reviewImage) {
            return res.status(404).json({ message: 'Review image not found' });
        }
        //user/owner check
        if (review.userId !== Number(userId)) {
            return res.status(403).json({ message: 'You are not authorized to delete this image' });
        }
        //delete
        await reviewImage.destroy();

        return res.json({ message: 'Review image deleted successfully' });
    });



//ADD IMAGE TO REVIEW
router.post(
    '/:reviewId/users/:userId/images', 
    requireAuth, 
    async (req, res) => {
    const { reviewId, userId } = req.params;
    const { url } = req.body;

    // review exist 
    const review = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

//user is the owner of review
if (review.userId !== Number(userId)) {
    return res.status(403).json({ message: 'You are not authorized to add an image to this review'
    });
}
//max number of image check
const existingImages = await ReviewImage.count({ 
    where: { reviewId } 
});
if (existingImages >= 10) {
    return res.status(403).json({ message: 'Maximum number of images for this resource was reached'});
}

//add image
const newImage = await ReviewImage.create({ reviewId, url });
    return res.status(201).json({ 
        id: newImage.id, url: newImage.url 
     });
    });

// //return w/ image data
// const formattedReview = {
//     ...review.toJSON(),
//     createdAt: format(new Date(review.createdAt), 'yyyy-MM-dd HH:mm:ss'),
//     updatedAt: format(new Date(review.updatedAt), 'yyyy-MM-dd HH:mm:ss'),
//   };


//EDIT REVIEW:
router.put(
    '/:reviewId/users/:userId',
    // requireAuth,
    async (req, res) => {
        const { reviewId, userId } = req.params;
        const { review, stars } = req.body;
//find review
        const reviewToUpdate = await Review.findByPk(reviewId);
        if (!reviewToUpdate) {
            return res.status(404).json({ message: 'Review not found' });
        }
//check owner
        if (reviewToUpdate.userId !== Number(userId)) {
            return res.status(403).json({ message: 'You are not authorized to edit this review'});
        }
//review content and stars
        if(!review || review.length < 10 || review.length > 256) {
            return res.status(400).json({ 
                message: "Bad Request",
                errors: {
                    review: 'Review must be between 10 and 256 characters'
                   }
                });
        }
        if (isNaN(stars) || stars < 1 || stars > 5) {
            return res.status(400).json({ 
                message: "Bad Request",
                errors: {
                    stars: "Stars must be between 1 and 5",
                  }
                });
        }
//update review
        reviewToUpdate.review = review;
        reviewToUpdate.stars = stars;

        await reviewToUpdate.save();

//update spots avgRating after edit
        const allReviews = await Review.findAll({ where: { spotId: reviewToUpdate.spotId } });
        const sum = allReviews.reduce((acc, el) => acc + el.stars, 0);
        const avgRating = sum / allReviews.length;

        const spot = await Spot.findByPk(reviewToUpdate.spotId);
        spot.avgRating = avgRating;
        await spot.save();

        return res.json(reviewToUpdate);
    });


    //DELETE REVIEW:
    router.delete(
        '/:reviewId/users/:userId', 
        // requireAuth, 
        async(req, res) => {
        const { reviewId, userId } = req.params;

        //find review
        const reviewToDelete = await Review.findByPk(reviewId);
        if (!reviewToDelete) {
            return res.status(404).json({ message: 'Review not found' });
        }

        //user is owner
        if (reviewToDelete.userId !== Number(userId)) {
            return res.status(403).json({ message: 'You are not authorized to delete this review.' });
        }
        //delete review
        await reviewToDelete.destroy();

        //update avgRating for spot
        const allReviews = await Review.findAll({ where: { spotId: reviewToDelete.spotId } });
        const sum = allReviews.reduce((acc, el) => acc + el.stars, 0);
        const avgRating = allReviews.length > 0 ? sum / allReviews.length : 0;

        const spot = await Spot.findByPk(reviewToDelete.spotId);
        spot.avgRating = avgRating;
        await spot.save();

        return res.json({ message: 'Review deleted successfully' });
    })


module.exports = router;