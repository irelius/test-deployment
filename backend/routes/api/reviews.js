// backend/routes/api/reviews.js
const express = require('express');

const router = express.Router();

const { User, Review, Spot, ReviewImage } = require('../../db/models');  //import models
const { requireAuth } = require('../../utils/auth');   //auth middleware

// GET all Reviews of current user 
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
      try{
        const { id } = req.user;

        // Find all reviews by the current user
        const userReviews = await Review.findAll({
          where: { userId: id },
          include: [
            {
              model: User,
            //   as: 'Owner',
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
  
      return res.json({ Reviews: formattedReviews })
    }catch (error) {
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }
  )
  

//ADD IMAGE TO REVIEW
router.post(
    '/:reviewId/images', 
    requireAuth, 
    async (req, res) => {
    const { id } = req.user;
    const { reviewId } = req.params;
    const { url } = req.body;

    // review exist 
    const review = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

//user is the owner of review
if (review.userId !== Number(id)) {
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


//EDIT REVIEW:
router.put(
    '/:reviewId',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { reviewId } = req.params;
        const { review, stars } = req.body;
//find review
        const reviewToUpdate = await Review.findByPk(reviewId);
        if (!reviewToUpdate) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }
//check owner
        if (reviewToUpdate.userId !== Number(id)) {
            return res.status(403).json({ message: 'You are not authorized to edit this review'});
        }
//review content and stars
        if(!review || review.length < 2 || review.length > 256 || isNaN(stars) || stars < 1 || stars > 5) {
            return res.status(400).json({ 
                message: "Bad Request",
                errors: {
                    review: "Review must be between 2 and 256 characters",
                    stars: "Stars must be between 1 and 5"
                   }
                });
        }
//update review
        reviewToUpdate.review = review;
        reviewToUpdate.stars = parseFloat(stars);

        const updatedReview = await reviewToUpdate.save();

//update spots avgRating after edit
        const allReviews = await Review.findAll({ where: { spotId: reviewToUpdate.spotId } });
        const sum = allReviews.reduce((acc, el) => acc + el.stars, 0);
        const avgRating = parseFloat((sum / allReviews.length).toFixed(1));

        const spot = await Spot.findByPk(reviewToUpdate.spotId);
        spot.avgRating = parseFloat(avgRating);
        await spot.save();

        const formattedCreatedAt = updatedReview.createdAt.toISOString().replace('T', ' ').slice(0, 19);
        const formattedUpdatedAt = updatedReview.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

        const formattedUpdatedReview = {
            ...updatedReview.toJSON(),
            stars: parseFloat(updatedReview.stars),
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt
        }

        return res.json(formattedUpdatedReview);
    });


    //DELETE REVIEW:
    router.delete(
        '/:reviewId', 
        requireAuth, 
        async(req, res) => {
        const { id } = req.user
        const { reviewId } = req.params;

        //find review
        const reviewToDelete = await Review.findByPk(reviewId);
        if (!reviewToDelete) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        //user is owner
        if (reviewToDelete.userId !== Number(id)) {
            return res.status(403).json({ message: 'You are not authorized to delete this review.' });
        }
        //delete review
        await reviewToDelete.destroy();

        //update avgRating for spot
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
    })


module.exports = router;