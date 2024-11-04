// backend/routes/api/spots.js
const express = require('express');
// const { User, Spot, SpotImage, Review, Booking } = require('../../db/models');
const { Spot } = require('../../db/models');

// const { environment } = require('./config');
// const app = require('../../app');
// const isProduction = environment === 'production';

// app.use(morgan('dev'));

const router = express.Router();

router.use(express.json());

router.get('/users/:userId/spots', async (req, res) => {
    const { userId } = req.params;

    const allSpotsByUser = await Spot.findAll({
        where: { ownerId: userId }
    })

    if (allSpotsByUser.length > 0) {
        res.status(200);
        res.json({ Spots: allSpotsByUser })
    } else {
        res.status(404);
        res.json({ message: 'The User has no Spots.' })
    }
})

module.exports = router;