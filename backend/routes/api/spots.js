// backend/routes/api/spots.js
const express = require('express');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');
const { format, roundToNearestHours } = require('date-fns');
const { Op } = require('sequelize');

// const { environment } = require('./config');
// const app = require('../../app');
// const isProduction = environment === 'production';

// app.use(morgan('dev'));

const router = express.Router();

router.use(express.json());

// Get all Spots owned by the Current User - as :userId
router.get('/users/:userId/spots', 
    // restoreUser,
    // requireAuth, 
    async (req, res) => {
        const { userId } = req.params;

        try {
            const allSpotsByUser = await Spot.findAll({
                where: { ownerId: userId }
            })

            if (allSpotsByUser.length > 0) {

                const formattedSpots = allSpotsByUser.map(date => {
                    // Format the createdAt and updatedAt for each spot
                    const formattedCreatedAt = format(new Date(date.createdAt), "yyyy-MM-dd HH:mm:ss");
                    const formattedUpdatedAt = format(new Date(date.updatedAt), "yyyy-MM-dd HH:mm:ss");

                    // Return a new object with the formatted dates
                    return {
                        ...date.toJSON(),
                        createdAt: formattedCreatedAt,
                        updatedAt: formattedUpdatedAt
                    };
                });

                return res.status(200).json({ Spots: formattedSpots })
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
            const spot = await Spot.findByPk(spotId)

            if (spot) {
                const newSpotImage = {
                    spotId: Number(spotId),
                    url: url,
                    preview: preview
                };
                const spotImage = await SpotImage.create(newSpotImage);

                // checking if there is a previewImage, if there is none, put the url into it
                if (!spot.previewImage) {
                    spot.previewImage = url;
                    await Spot.save(spot);
                }

                const formattedCreatedAt = format(new Date(spotImage.createdAt), "yyyy-MM-dd HH:mm:ss");
                const formattedUpdatedAt = format(new Date(spotImage.updatedAt), "yyyy-MM-dd HH:mm:ss");

                const formattedSpotImageDetail = {
                    ...spotImage.toJSON(),
                    createdAt: formattedCreatedAt,
                    updatedAt: formattedUpdatedAt
                }

                return res.status(201).json(formattedSpotImageDetail);
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

        try {
            const reviewBySpotId = await Review.findAll({
                where: { spotId: spotId },
                include: [
                    { model: User ,
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    { model: ReviewImage,
                        attributes: ['id', 'url']
                    }
                ]
            });

            if (reviewBySpotId.length > 0) {

                const formattedReviews = reviewBySpotId.map(date => {
                    // Format the createdAt and updatedAt for each spot
                    const formattedCreatedAt = format(new Date(date.createdAt), "yyyy-MM-dd HH:mm:ss");
                    const formattedUpdatedAt = format(new Date(date.updatedAt), "yyyy-MM-dd HH:mm:ss");

                    // Return a new object with the formatted dates
                    return {
                        ...date.toJSON(),
                        createdAt: formattedCreatedAt,
                        updatedAt: formattedUpdatedAt
                    };
                });
    
                return res.status(200).json({ Reviews: formattedReviews });
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

        if (review.length < 1 || Number(stars) < 1 || Number(stars) > 5) {
            return res.status(400).json({ 
                message: "Bad Request",
                errors: {
                    review: "Review text is required",
                    stars: "Stars must be an integer from 1 to 5"
                }
            })
        }

        try {
            const spot = await Spot.findByPk(spotId)

            if (spot) {
                const spotNewReview = {
                    userId: spot.ownerId,
                    spotId: spot.id,
                    review: review,
                    stars: Number(stars)
                }

                const newReview = await Review.create(spotNewReview);

                if (newReview) {

                    const formattedCreatedAt = format(new Date(newReview.createdAt), "yyyy-MM-dd HH:mm:ss");
                    const formattedUpdatedAt = format(new Date(newReview.updatedAt), "yyyy-MM-dd HH:mm:ss");
    
                    const formattedNewReview = {
                        ...newReview.toJSON(),
                        createdAt: formattedCreatedAt,
                        updatedAt: formattedUpdatedAt
                    }

                    res.status(201).json(formattedNewReview)
                    
                    // update avgRating in Spots
                    const allReviews = await Review.findAll({ where: { spotId: spotId} })
                    const sum = allReviews.reduce((acc, el) => acc + el.stars, 0);
                    const avgRating = parseFloat((sum / allReviews.length).toFixed(1));

                    spot.avgRating = avgRating;
                    await spot.save();
                    return
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
                        as: "Owner",
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

router.get('/query',
    async (req, res) => {
        const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
        let check = true;

        try {
            let pageNum = parseInt(page);
            let sizeNum = parseInt(size);

            if (isNaN(pageNum)) pageNum = 1;
            if (isNaN(sizeNum)) sizeNum = 20;
            if (sizeNum > 20) sizeNum = 20;

            if (minLat && minLat < -90) check = false;
            if (maxLat && maxLat > 90) check = false;
            if (minLng && minLng < -180) check = false;
            if (maxLng && maxLng > 180) check = false;
            if (minPrice && minPrice < 0) check = false;
            if (maxPrice && maxPrice < 0) check = false;
            if (minPrice && maxPrice && minPrice > maxPrice) check = false;

            if (check === false) {
                return res.status(400).json({
                    message: "Bad Request", // (or "Validation error" if generated by Sequelize),
                    errors: {
                      variable: "All inputs / variables should be integer or decimal",  
                      page: "Page must be greater than or equal to 1",
                      size: "Size must be between 1 and 20",
                      minLat: "Minimum latitude is invalid",
                      maxLat: "Maximum latitude is invalid",
                      minLng: "Maximum longitude is invalid",
                      maxLng: "Minimum longitude is invalid",
                      minPrice: "Minimum price must be greater than or equal to 0",
                      maxPrice: "Maximum price must be greater than or equal to 0",
                      minPrice_and_maxPrice: "minPrice should be lower than maxPrice"
                    }
                })
            }

            const where = {};

            if (minLat && maxLat) {
                where.lat = { [Op.between]: [parseFloat(minLat), parseFloat(maxLat)] }
            } else if (minLat) {
                where.lat = { [Op.between]: [parseFloat(minLat), 90] }
            } else if (maxLat) {
                where.lat = { [Op.between]: [-90, parseFloat(maxLat)] }
            }

            if (minLng && maxLng) {
                where.lat = { [Op.between]: [parseFloat(minLng), parseFloat(maxLng)] }
            } else if (minLng) {
                where.lat = { [Op.between]: [parseFloat(minLng), 180] }
            } else if (maxLng) {
                where.lat = { [Op.between]: [-180, parseFloat(maxLng)] }
            }

            if (minPrice && maxPrice) {
                where.price = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] }
            } else if (minPrice) {
                where.price = { [Op.gte]: [parseFloat(minPrice)] }
            } else if (maxPrice) {
                where.price = { [Op.lte]: [parseFloat(maxPrice)] }
            }

            const allSpots = await Spot.findAll({
                where,
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum
            });

            if (!allSpots) {
                return res.status(400).json({ message: "There is no Spot in the system" })
            }

            // Map through all the spots and format their createdAt and updatedAt
            const formattedSpots = allSpots.map(spot => {
                // Format the createdAt and updatedAt for each spot
                const formattedCreatedAt = format(new Date(spot.createdAt), "yyyy-MM-dd HH:mm:ss");
                const formattedUpdatedAt = format(new Date(spot.updatedAt), "yyyy-MM-dd HH:mm:ss");

                // Return a new object with the formatted dates
                return {
                    ...spot.toJSON(),
                    createdAt: formattedCreatedAt,
                    updatedAt: formattedUpdatedAt
                };
            });

            return res.status(200).json(formattedSpots);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while getting all Spots by query" })
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
                    return res.status(404).json({ message: "The Spot is not belong to the User, can't update" })
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

                const updatedSpot = await spotDetail.save();

                const formattedCreatedAt = format(new Date(updatedSpot.createdAt), "yyyy-MM-dd HH:mm:ss");
                const formattedUpdatedAt = format(new Date(updatedSpot.updatedAt), "yyyy-MM-dd HH:mm:ss");

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

router.delete('/:spotId/users/:userId',
    // requireAuth,
    async (req, res) => {
        const { spotId, userId } = req.params;

        try {
            const spotToDelete = Spot.findByPk(spotId);

            if (spotToDelete && spotToDelete.ownerId !== Number(userId)) {
                return res.status(400).json({ message: "This Spot is not belong to the User, can't delete" })
            } else {
                if (spotToDelete) {
                    await spotToDelete.destroy();
                    return res.status(200).json({ message: "Successfully deleted" });
                } else {
                    return res.status(404).json({ message: "Spot couldn't be found" })
                }
            } 
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while deleting a Spot" })
        }
    }
)

router.post('/users/:userId/new',
    // requireAuth,
    async (req, res) => {
        const { userId } = req.params;
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        let check = true;

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
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(400).json({ message: "User doesn't exist in the system" })
            }

            let spotDetail = {};
            spotDetail.ownerId = Number(userId);
            spotDetail.address = address;
            spotDetail.city = city;
            spotDetail.state = state;
            spotDetail.country = country;
            spotDetail.lat = Number(lat);
            spotDetail.lng = Number(lng);
            spotDetail.name = name;
            spotDetail.description = description;
            spotDetail.price = Number(price);

            const createdSpot = await Spot.create(spotDetail);

            const formattedCreatedAt = format(new Date(createdSpot.createdAt), "yyyy-MM-dd HH:mm:ss");
            const formattedUpdatedAt = format(new Date(createdSpot.updatedAt), "yyyy-MM-dd HH:mm:ss");

            const formattedSpotDetail = {
                ...createdSpot.toJSON(),
                createdAt: formattedCreatedAt,
                updatedAt: formattedUpdatedAt
            }
            return res.status(201).json(formattedSpotDetail);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while creating a new Spot" })
        }
    }
)

router.get('/',
    async (req, res) => {
        
        try {
            const allSpots = await Spot.findAll();

            if (!allSpots) {
                return res.status(400).json({ message: "There is no Spot in the system" })
            }

            // Map through all the spots and format their createdAt and updatedAt
            const formattedSpots = allSpots.map(spot => {
                // Format the createdAt and updatedAt for each spot
                const formattedCreatedAt = format(new Date(spot.createdAt), "yyyy-MM-dd HH:mm:ss");
                const formattedUpdatedAt = format(new Date(spot.updatedAt), "yyyy-MM-dd HH:mm:ss");

                // Return a new object with the formatted dates
                return {
                    ...spot.toJSON(),
                    createdAt: formattedCreatedAt,
                    updatedAt: formattedUpdatedAt
                };
            });

            return res.status(200).json({ Spots: formattedSpots });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while getting all Spots" })
        }
    }   
)






module.exports = router;