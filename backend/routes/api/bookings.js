// backend/routes/api/bookings.js
const express = require('express');
const { Booking, Spot, User } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')
const router = express.Router();
const { format } = require('date-fns');

// GET all the bookings based on the userId (login userId)
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
    const { id } = req.user;

    try {
        const bookings = await Booking.findAll({
            where: { userId: id },
            include: [{ model: Spot,
                attributes: {
                    exclude: ['description', 'avgRating', 'createdAt', 'updatedAt']
                }
             }]
        });
        
        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found for the user." });
        }

        // Map through all the spots and format their createdAt and updatedAt
        const formattedBookings = bookings.map(book => {
            // Format the createdAt and updatedAt for each spot
            const formattedStartDate = book.startDate.toISOString().split('T')[0];
            const formattedEndDate = book.endDate.toISOString().split('T')[0];
            const formattedCreatedAt = book.createdAt.toISOString().replace('T', ' ').slice(0, 19);
            const formattedUpdatedAt = book.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

            // Return a new object with the formatted dates
            return {
                id: book.id,
                spotId: book.spotId,
                Spot: book.Spot,
                userId: book.userId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                createdAt: formattedCreatedAt,
                updatedAt: formattedUpdatedAt
            };
        });

        return res.status(200).json({ Bookings: formattedBookings });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while getting all the bookings of a User" })
    }
})

// PUT (edit) a booking + userId as the owner of the booking
// the userId can be taken out later when there is a login
router.put(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { bookingId } = req.params;
        const { startDate, endDate } = req.body;

        const today = new Date();
        const newToday = today.toISOString().split('T')[0];

        // dates
        if (startDate >= endDate || startDate < newToday) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    startDate: "startDate cannot be in the past",
                    endDate: "endDate cannot be on or before startDate"
                }
            })
        }

        try {
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                return res.status(404).json({ message: "Booking couldn't be found" });
            }
 
            const formattedStartDate = booking.startDate.toISOString().split('T')[0];
            const formattedEndDate = booking.endDate.toISOString().split('T')[0];

            //belong to user
            if (Number(booking.userId) !== Number(id)) {
                return res.status(403).json({ message: "Unauthorized to edit this booking"});
            }

            if (formattedEndDate < newToday) {
                return res.status(403).json({ message: "Past bookings can't be modified" })
            }

            if ((formattedStartDate < endDate) && (formattedEndDate > startDate)) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {
                      startDate: "Start date conflicts with an existing booking",
                      endDate: "End date conflicts with an existing booking"
                }})
            }

            booking.startDate = startDate;
            booking.endDate = endDate;
            const updatedBooking = await booking.save();

            const updatedStartDate = updatedBooking.startDate.toISOString().split('T')[0];
            const updatedEndDate = updatedBooking.endDate.toISOString().split('T')[0];
            const updatedCreatedAt = updatedBooking.createdAt.toISOString().replace('T', ' ').slice(0, 19);
            const updatedUpdatedAt = updatedBooking.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

            const updatedBookingDetail = {
                ...updatedBooking.toJSON(),
                startDate: updatedStartDate,
                endDate: updatedEndDate,
                createdAt: updatedCreatedAt,
                updatedAt: updatedUpdatedAt
            }
            return res.status(200).json(updatedBookingDetail);
        } catch (error) {
            return res.status(500).json({ message: "An error occurred on editing a booking" })
        }
    }
);

// DELETE a booking + userId as the owner of the booking or owner of the Spot
// the userId can be taken out later when there is a login
router.delete(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { bookingId } = req.params;

        try {
            const booking = await Booking.findByPk(bookingId);
            if(!booking || booking.length <= 0) {
                return res.status(404).json({ message: "Booking couldn't be found" });
            }
            //auth check
            const spot = await booking.getSpot();

            if (booking.userId !== Number(id) && spot.ownerId !== Number(id)) {
                return res.status(403).json({ message: "Unauthorized to delete this booking" });
            }
            //booking started
            if (new Date() >= new Date(booking.startDate)) {
                return res.status(403).json({ message: "Bookings that have been started can't be deleted "});
            }
            await booking.destroy();
            return res.status(200).json({ message: "Successfully deleted" });
        } catch (error) {
            return res.status(500).json({ message: "An error occurred while deleting a booking" })
        }
    }   
);

module.exports = router;