const express = require('express');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();

router.use(express.json());

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

module.exports = router;