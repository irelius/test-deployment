// backend/routes/api/bookings.js
const express = require('express');
const { Booking, Spot, User } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')
const router = express.Router();
const { format } = require('date-fns');

//GET ALL CURRENT USER BOOKINGS:
router.get(
    '/:userId',
    requireAuth,
    async (req, res) => {
    const { userId } = req.params;
    const bookings = await Booking.findAll({
        where: { userId },
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']
            }
        ]
    });
    
    if (!bookings.length) {
        return res.status(404).json({ message: "No bookings found for the user." });
    }

    res.status(200).json({ Bookings: bookings });
})


//EDIT BOOKING
router.put(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const { bookingId } = req.params;
        const { startDate, endDate } = req.body;
        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

//belong to user
    if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to edit this booking"});
    }
//dates
    if (new Date(startDate) <= new Date()) {
        return res.status(400).json({
            message: "Start date cannot be in the past",
            errors: { endDate: "End date cannot be on or before start date" }
        });
    }
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    res.status(200).json(booking);
    });



//DELETE BOOKING
router.delete(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const { bookingId } = req.params;
        const booking = await Booking.findByPk(bookingId);

    if(!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }
//auth check
    const spot = await booking.getSpot();
    if (booking.userId !== req.user.id && spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this booking" });
    }
//booking started
    if (new Date() >= new Date(booking.startDate)) {
        return res.status(403).json({ message: "Bookings that have been started can't be deleted "});
    }
    await booking.destroy();
    res.status(200).json({ message: "Successfully deleted" });
    });


module.exports = router;