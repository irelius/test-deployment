const express = require('express');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();

router.use(express.json());

//DELETE IMAGE FROM REVIEW:
router.delete(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { imageId } = req.params;
  
        //find image
        const reviewImage = await ReviewImage.findByPk(imageId);
        if (!reviewImage) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
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
  
        return res.json({ message: 'Successfully deleted' });
});

module.exports = router;