const express = require('express');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();

router.use(express.json());

// DELETE a Spot Image
router.delete('/:imageId',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { imageId } = req.params;
  
        try {
            const imageBySpot = await SpotImage.findByPk(imageId);
            if (!imageBySpot || imageBySpot.length <= 0) {
                return res.status(404).json({ message: "Spot Image couldn't be found" })
            }

            const spot = await Spot.findByPk(imageBySpot.spotId)
            if (!spot || spot.length <= 0) {
                return res.status(404).json({ message: "The Spot couldn't be found" })
            }
  
            if (spot.ownerId !== Number(id)) {
                return res.status(403).json({ message: "You are not authorized to delete this image" })
            }
  
            await imageBySpot.destroy();
            return res.status(200).json({ message: "Successfully deleted" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while deleting the image" })
        }
    }
  )

module.exports = router;