// backend/routes/api/spots.js
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');
const { format } = require('date-fns');
const { Op } = require('sequelize');

// const { environment } = require('./config');
// const app = require('../../app');
// const isProduction = environment === 'production';

// app.use(morgan('dev'));

const router = express.Router();

router.use(express.json());

router.get('/users/:userId/spots', 
    // requireAuth, 
    async (req, res) => {
        const { userId } = req.params;

        try {
            const allSpotsByUser = await Spot.findAll({
                where: { ownerId: userId }
            })

            if (allSpotsByUser.length > 0) {
                return res.status(200).json({ Spots: allSpotsByUser })
            } else {
                return res.status(404).json({ message: "User has no Spot." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while getting the Spots" })
        }
})

router.delete('/:spotId/images/:spotImageId',
    // requireAuth,
    async (req, res) => {
        const { spotId, spotImageId } = req.params;

        try {
            const imageBySpot = await SpotImage.findOne({
                where: { spotId: spotId, id: spotImageId }
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

router.post('/:spotId/images',
    // requireAuth,
    async (req, res) => {
        const { spotId } = req.params;
        const { url, preview } = req.body;

        try {
            const spotImage = await SpotImage.create({ spotId, url, preview });

            if (spotImage) {
                const newSpotImage = {
                    id: spotImage.id,
                    url: spotImage.url,
                    preview: spotImage.preview
                };
                return res.status(201).json({ newImage: newSpotImage });
            } else {
                return res.status(404).json({ message: "Spot couldn't be found" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while adding a new image" })
        }   

    }
)

router.get('/:spotId/reviews',
    async (req, res) => {
        const { spotId } = req.params;
        console.log(spotId);
        try {
            const reviewBySpotId = await Review.findAll({
                where: { spotId: spotId },
                include: [
                    { model: User },
                    { model: ReviewImage,
                        attributes: ['id', 'url']
                    }
                ]
            });
            console.log(reviewBySpotId)
            if (reviewBySpotId) {
                return res.status(200).json({ Reviews: reviewBySpotId })
            } else {
                return res.status(404).json({ message: "Spot couldn't be found" })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while getting the reviews" })
        }
    }
)

router.post('/:spotId/reviews',
    // requireAuth,
    async (req, res) => {
        const { spotId } = req.params;
        const { review, stars } = req.body;

        if (review.length < 11 || Number(stars) < 1 || Number(stars) > 5) {
            return res.status(400).json({ 
                message: "Bad Request",
                errors: {
                    review: "Review text is required",
                    stars: "Stars must be an integer from 1 to 5"
                }
            })
        }

        try {
            const spot = await Spot.findOne({
                where: { id: spotId }
            })

            if (spot) {
                const spotNewReview = {
                    userId: spot.ownerId,
                    spotId: spot.id,
                    review: review,
                    stars: Number(stars)
                }

                const newReview = await Review.create(spotNewReview);

                if (newReview) {
                    return res.status(201).json({ newReview })
                } else {
                    return res.status(400).json({ 
                        message: "Bad Request",
                        errors: {
                            review: "Review text is required",
                            stars: "Stars must be an integer from 1 to 5"
                        }
                    })
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while creating a new Review" })
        }
    }
)

router.get('/:spotId/bookings',
    // requireAuth,
    async (req, res) => {
        const { spotId } = req.params;

        try {
            const spot = await Spot.findOne({
                where: { id: spotId },
                include: [
                    { model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            })

            const booking = await Booking.findAll({
                where: { spotId: spotId }
            })

            let bookingResult = []
            let result = {}

            booking.forEach(el => {
                if (el.userId === spot.ownerId) {
                    result.User = spot.User;

                    result.id = el.id;
                    result.spotId = spotId;
                    result.userId = el.userId;

                    result.startDate = format(new Date(el.startDate), "yyyy-MM-dd");
                    result.endDate = format(new Date(el.endDate), "yyyy-MM-dd");
                    result.createdAt = format(new Date(el.createdAt), "yyyy-MM-dd HH:mm:ss");
                    result.updatedAt = format(new Date(el.updatedAt), "yyyy-MM-dd HH:mm:ss");
                    bookingResult.push(result);
                    res.status(200).json({ Bookings: bookingResult })
                } else {
                    result.spotId = el.spotId;

                    result.startDate = format(new Date(el.startDate), "yyyy-MM-dd");
                    result.endDate = format(new Date(el.endDate), "yyyy-MM-dd");
                    bookingResult.push(result);
                    res.status(200).json({ Bookings: bookingResult })
                }
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while getting the bookings" })
        }
    }
)

router.post('/:spotId/bookings/:userId',
    // requireAuth,
    async (req, res) => {
        const { spotId, userId } = req.params;
        const { startDate, endDate } = req.body;
        const today = new Date();
        const newToday = format(new Date(today), "yyyy-MM-dd")
        const newStartDate = new Date(startDate);
        const newEndDate = new Date (endDate);

        if (newStartDate >= newEndDate || newStartDate < newToday) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    startDate: "startDate cannot be in the past",
                    endDate: "endDate cannot be on or before startDate"
                }
            })
        }

        const user = await User.findOne({
            where: { id: userId }
        })
        if (!user) {
            return res.status(404).json({ message: "User is not exist" })
        }

        const spot = await Spot.findOne({
            where: { id: Number(spotId) }
        })
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" })
        }
        if (spot.ownerId === Number(userId)) {
            return res.status(404).json({ message: "An Owner can't book his / her own Spot" })
        }

        try {
            const conflictingBooking = await Booking.findAll({
                where: { 
                    spotId: spotId,
                    [Op.or]: [
                        {
                            startDate: { [Op.lt]: newEndDate },
                            endDate: { [Op.gt]: newStartDate }
                        }
                    ]
                 }
            })

            if (conflictingBooking.length > 0) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                })
            }

            const newBooking = await Booking.create({
                spotId: spotId,
                userId: userId,
                startDate: newStartDate,
                endDate: newEndDate
            })

            const formattedBooking = {
                ...newBooking.toJSON(),
                startDate: format(new Date(newBooking.startDate), "yyyy-MM-dd"),
                endDate: format(new Date(newBooking.endDate), "yyyy-MM-dd"),
                createdAt: format(new Date(newBooking.createdAt), "yyyy-MM-dd HH:mm:ss"),
                updatedAt: format(new Date(newBooking.updatedAt), "yyyy-MM-dd HH:mm:ss")
            }

            return res.status(201).json({
                id: formattedBooking.id,
                spotId: formattedBooking.spotId,
                userId: formattedBooking.userId,
                startDate: formattedBooking.startDate,
                endDate: formattedBooking.endDate,
                createdAt: formattedBooking.createdAt,
                updatedAt: formattedBooking.updatedAt
            })    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while making a booking" })
        }
    }
)

router.get('/:spotId',
    async (req, res) => {
        const { spotId } = req.params;

        try {
            const spotDetail = await Spot.findOne({
                where: { id: spotId },
                include: [
                    { model: SpotImage,
                        attributes: ['id', 'url', 'preview']
                    },
                    { model: User,
                        as: 'Owner',
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            })

            if (spotDetail) {
                const formattedCreatedAt = format(new Date(spotDetail.createdAt), "yyyy-MM-dd HH:mm:ss");
                const formattedUpdatedAt = format(new Date(spotDetail.updatedAt), "yyyy-MM-dd HH:mm:ss");

                const formattedSpotDetail = {
                    ...spotDetail.toJSON(),
                    createdAt: formattedCreatedAt,
                    updatedAt: formattedUpdatedAt
                }
                return res.status(200).json(formattedSpotDetail);
            } else {
                return res.status(404).json({ message: "Spot couldn't be found" })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while getting a Spot" })
        }
    }
)

router.put('/:spotId/users/:userId',
    // requireAuth,
    async (req, res) => {
        const { spotId, userId } = req.params;
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        let check = true;
        console.log(req.body);

        if (!address || address.length < 4) check = false;
        if (!city || city.length < 2) check = false;
        if (!state || state.length < 2) check = false;
        if (!country || country.length < 2) check = false;
        if (!lat || lat < -90 || lat > 90) check = false;
        if (!lng || lng < -180 || lng > 180) check = false;
        if (!name || name.length < 2) check = false;
        if (!description || description.length < 2) check = false;
        if (!price || price < 0) check = false;
        if (check === false) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                  address: "Street address is required",
                  city: "City is required",
                  state: "State is required",
                  country: "Country is required",
                  lat: "Latitude must be within -90 and 90",
                  lng: "Longitude must be within -180 and 180",
                  name: "Name must be less than 50 characters",
                  description: "Description is required",
                  price: "Price per day must be a positive number"
                }
            })
        }

        try {
            const spotDetail = await Spot.findByPk(spotId);

            if (spotDetail) {

                if (spotDetail.ownerId !== Number(userId)) {
                    return res.status(404).json({ message: "The Spot is not belong to you, can't update" })
                }

                spotDetail.address = address;
                spotDetail.city = city;
                spotDetail.state = state;
                spotDetail.country = country;
                spotDetail.lat = Number(lat);
                spotDetail.lng = Number(lng);
                spotDetail.name = name;
                spotDetail.description = description;
                spotDetail.price = Number(price);

                await Spot.update(spotDetail, { where: { id: spotId }});

                const formattedCreatedAt = format(new Date(spotDetail.createdAt), "yyyy-MM-dd HH:mm:ss");
                const formattedUpdatedAt = format(new Date(spotDetail.updatedAt), "yyyy-MM-dd HH:mm:ss");

                const formattedSpotDetail = {
                    ...spotDetail.toJSON(),
                    createdAt: formattedCreatedAt,
                    updatedAt: formattedUpdatedAt
                }
                return res.status(200).json(formattedSpotDetail);
            } else {
                return res.status(404).json({ message: "Spot couldn't be found" })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while updating a Spot" })
        }
    }
)

        // include: [
        //     { model: SpotImage, },
        //     { model: User,
        //         attributes: ['id', 'firstName', 'lastName']
        //     }
        // ]

module.exports = router;