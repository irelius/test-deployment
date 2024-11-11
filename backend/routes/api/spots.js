// backend/routes/api/spots.js
const express = require('express');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { Op } = require('sequelize');

// example for date formatting
// const updatedEndDate = updatedBooking.endDate.toISOString().split('T')[0];
// const updatedCreatedAt = updatedBooking.createdAt.toISOString().replace('T', ' ').slice(0, 19);

const router = express.Router();

router.use(express.json());

// GET all Spots owned by the Current User 
router.get('/current', 
    requireAuth, 
    async (req, res) => {
        const { id } = req.user;

        try {
            const allSpotsByUser = await Spot.findAll({
                where: { ownerId: id }
            })

            if (allSpotsByUser.length > 0) {

                const formattedSpots = allSpotsByUser.map(date => {
                    // Format the createdAt and updatedAt for each spot
                    const formattedCreatedAt = date.createdAt.toISOString().replace('T', ' ').slice(0, 19);
                    const formattedUpdatedAt = date.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

                    // Return a new object with the formatted dates
                    return {
                        ...date.toJSON(),
                        price: Number(date.price),
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


// POST (add) an Image to a Spot based on the Spot's Id
router.post('/:spotId/images',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { spotId } = req.params;
        const { url, preview } = req.body;

        try {
            const spot = await Spot.findByPk(spotId)

            if (spot) {

                if (spot.ownerId !== Number(id)) {
                    return res.status(403).json({ message: "User not authorize to add an image to the Spot" })
                }

                const newSpotImage = {
                    spotId: Number(spotId),
                    url: url,
                    preview: preview
                };
                const spotImage = await SpotImage.create(newSpotImage);

                // checking if there is no previewImage in Spot, put the url in it and save it.
                if (!spot.previewImage) {
                    spot.previewImage = url;
                    await spot.save();
                }

                const formattedCreatedAt = spotImage.createdAt.toISOString().replace('T', ' ').slice(0, 19);
                const formattedUpdatedAt = spotImage.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

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

// GET all Reviews by a Spot's Id
router.get('/:spotId/reviews',
    async (req, res) => {
        const { spotId } = req.params;

        try {
            const spot = await Spot.findByPk(spotId);
            if (!spot || spot.length <= 0) {
                return res.status(404).json({ message: "Spot couldn't be found" })
            }

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
                    const formattedCreatedAt = date.createdAt.toISOString().replace('T', ' ').slice(0, 19);
                    const formattedUpdatedAt = date.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

                    // Return a new object with the formatted dates
                    return {
                        ...date.toJSON(),
                        createdAt: formattedCreatedAt,
                        updatedAt: formattedUpdatedAt
                    };
                });
    
                return res.status(200).json({ Reviews: formattedReviews });
            } else {
                return res.status(404).json({ message: "There is no reviews for this Spot" })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while getting the reviews" })
        }
    }
)

// POST (create) a Review for a Spot based on the Spot's Id
router.post('/:spotId/reviews',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { spotId } = req.params;
        const { review, stars } = req.body;

        if (!review || review.length < 2 || !stars || isNaN(stars) || stars < 1 || stars > 5) {
            return res.status(400).json({ 
                message: "Bad Request",
                errors: {
                    review: "Review text is required",
                    stars: "Stars must be an integer from 1 to 5"
                }
            })
        }

        try {
            const reviewByUser = await Review.findAll({
                where: { userId: id, spotId: spotId }
            });
            if (reviewByUser.length > 0) {
                return res.status(500).json({ message: "User already has a review for this spot" })
            }

            const spot = await Spot.findByPk(spotId)
            if (spot) {
                const spotNewReview = {
                    userId: Number(id),
                    spotId: spot.id,
                    review: review,
                    stars: parseFloat(stars)
                }

                const newReview = await Review.create(spotNewReview);

                if (newReview) {

                    const formattedCreatedAt = newReview.createdAt.toISOString().replace('T', ' ').slice(0, 19);
                    const formattedUpdatedAt = newReview.updatedAt.toISOString().replace('T', ' ').slice(0, 19);
    
                    const formattedNewReview = {
                        ...newReview.toJSON(),
                        stars: parseFloat(newReview.stars),
                        createdAt: formattedCreatedAt,
                        updatedAt: formattedUpdatedAt
                    }

                    // update avgRating in Spots
                    const allReviews = await Review.findAll({ where: { spotId: spotId} })
                    const sum = allReviews.reduce((acc, el) => acc + el.stars, 0);
                    const avgRating = parseFloat((sum / allReviews.length).toFixed(1));

                    spot.avgRating = parseFloat(avgRating);
                    await spot.save();

                    return res.status(201).json(formattedNewReview)
                } else {
                    return res.status(400).json({ 
                        message: "Bad Request",
                        errors: {
                            review: "Review text is required",
                            stars: "Stars must be an integer from 1 to 5"
                        }
                    })
                }
            } else {
                return res.status(404).json({ message: "Spot couldn't be found" })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while creating a new Review" })
        }
    }
)

// GET all Bookings for a Spot based on the Spot's Id
router.get('/:spotId/bookings',
    requireAuth,
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

            if (!spot) {
                return res.status(404).json({ message: "The Spot is not found" })
            }

            const booking = await Booking.findAll({
                where: { spotId: spotId }
            })

            if (booking.length <= 0) {
                return res.status(404).json({ message: "There is NO booking for this Spot" })
            }

            let bookingResult = []
            let result = {}

            booking.forEach(el => {
                if (el.userId === spot.ownerId) {
                    result.User = spot.Owner;

                    result.id = el.id;
                    result.spotId = spotId;
                    result.userId = el.userId;

                    result.startDate = el.startDate.toISOString().split('T')[0];
                    result.endDate = el.endDate.toISOString().split('T')[0];
                    result.createdAt = el.createdAt.toISOString().replace('T', ' ').slice(0, 19);
                    result.updatedAt = el.updatedAt.toISOString().replace('T', ' ').slice(0, 19);
                    bookingResult.push(result);
                    return res.status(200).json({ Bookings: bookingResult })
                } else {
                    result.spotId = el.spotId;

                    result.startDate = el.startDate.toISOString().split('T')[0];
                    result.endDate = el.endDate.toISOString().split('T')[0];
                    bookingResult.push(result);
                    return res.status(200).json({ Bookings: bookingResult })
                }
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while getting the bookings" })
        }
    }
)

// POST (create) a Booking from a Spot based on the Spot's Id
router.post('/:spotId/bookings',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { spotId } = req.params;
        const { startDate, endDate } = req.body;
        const today = new Date();
        const newToday = today.toISOString().split('T')[0];

        if (startDate >= endDate || startDate < newToday) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    startDate: "startDate cannot be in the past",
                    endDate: "endDate cannot be on or before startDate"
                }
            })
        }

        const user = await User.findByPk(Number(id));
        if (!user) {
            return res.status(404).json({ message: "User is not exist" })
        }

        const spot = await Spot.findOne({
            where: { id: Number(spotId) }
        })
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" })
        }
        if (spot.ownerId === Number(id)) {
            return res.status(403).json({ message: "An Owner can't book his / her own Spot" })
        }

        try {
            const conflictingBooking = await Booking.findAll({
                where: { 
                    spotId: spotId,
                    [Op.or]: [
                        {
                            startDate: { [Op.lt]: endDate },
                            endDate: { [Op.gt]: startDate }
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
                spotId: Number(spotId),
                userId: Number(id),
                startDate: startDate,
                endDate: endDate
            })

            const formattedBooking = {
                ...newBooking.toJSON(),
                startDate: newBooking.startDate.toISOString().split('T')[0],
                endDate: newBooking.endDate.toISOString().split('T')[0],
                createdAt: newBooking.createdAt.toISOString().replace('T', ' ').slice(0, 19),
                updatedAt: newBooking.updatedAt.toISOString().replace('T', ' ').slice(0, 19)
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

// PUT (edit) a Spot
router.put('/:spotId',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { spotId } = req.params;
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

                if (spotDetail.ownerId !== Number(id)) {
                    return res.status(403).json({ message: "The Spot is not belong to the User, can't update" })
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

                const formattedCreatedAt = updatedSpot.createdAt.toISOString().replace('T', ' ').slice(0, 19);
                const formattedUpdatedAt = updatedSpot.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

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

// DELETE a Spot
router.delete('/:spotId',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { spotId } = req.params;

        try {
            const spotToDelete = await Spot.findByPk(spotId);

            if (!spotToDelete || spotToDelete.length <= 0) {
                return res.status(404).json({ message: "Spot couldn't be found" })
            }

            if (spotToDelete.ownerId !== Number(id)) {
                return res.status(403).json({ message: "This Spot is not belong to the User, can't delete" })
            }

            if (spotToDelete || spotToDelete.length > 0) {
                await spotToDelete.destroy();
                return res.status(200).json({ message: "Successfully deleted" });
            } else {
                return res.status(404).json({ message: "Spot couldn't be found" })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while deleting a Spot" })
        }
    }
)

// POST (create) a Spot
router.post('/',
    requireAuth,
    async (req, res) => {
        const { id } = req.user;
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        let check = true;

        const isValidDecimal = (value) => !isNaN(value) && !isNaN(parseFloat(value));

        if (!address || address.length < 4) check = false;
        if (!city || city.length < 2) check = false;
        if (!state || state.length < 2) check = false;
        if (!country || country.length < 2) check = false;
        if (!lat || !isValidDecimal(lat) || lat < -90 || lat > 90) check = false;
        if (!lng || !isValidDecimal(lng) || lng < -180 || lng > 180) check = false;
        if (!name || name.length < 2) check = false;
        if (!description || description.length < 2) check = false;
        if (!price || !isValidDecimal(price) || price < 0) check = false;
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
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(400).json({ message: "User doesn't exist in the system" })
            }

            let spotDetail = {};
            spotDetail.ownerId = Number(id);
            spotDetail.address = address;
            spotDetail.city = city;
            spotDetail.state = state;
            spotDetail.country = country;
            spotDetail.lat = parseFloat(lat);
            spotDetail.lng = parseFloat(lng);
            spotDetail.name = name;
            spotDetail.description = description;
            spotDetail.price = parseFloat(price);

            const createdSpot = await Spot.create(spotDetail);

            const formattedCreatedAt = createdSpot.createdAt.toISOString().replace('T', ' ').slice(0, 19);
            const formattedUpdatedAt = createdSpot.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

            const formattedSpotDetail = {
                ...createdSpot.toJSON(),
                lat: parseFloat(createdSpot.lat),
                lng: parseFloat(createdSpot.lng),
                price: parseFloat(createdSpot.price),
                createdAt: formattedCreatedAt,
                updatedAt: formattedUpdatedAt
            }
            delete formattedSpotDetail.avgRating;
            delete formattedSpotDetail.previewImage;
            return res.status(201).json(formattedSpotDetail);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while creating a new Spot" })
        }
    }
)

// GET details of a Spot from a Spot's Id
router.get('/:spotId',
    async (req, res) => {
        const { spotId } = req.params;

        try {
            const spotDetail = await Spot.findOne({
                where: { id: spotId },
                attribute: {
                    exclude: ['avgRating', 'previewImage']
                }, 
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
                const formattedCreatedAt = spotDetail.createdAt.toISOString().replace('T', ' ').slice(0, 19);
                const formattedUpdatedAt = spotDetail.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

                const numReviews = await Review.count({
                    where: { spotId: spotId }
                })
                const avgStarRating = await Review.aggregate('stars', 'avg', {
                    where: { spotId: spotId }
                })

                const formattedSpotDetail = {
                    ...spotDetail.toJSON(),
                    createdAt: formattedCreatedAt,
                    updatedAt: formattedUpdatedAt,
                    numReviews,
                    avgStarRating
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

// GET all Spots based on the query filter
router.get('/',
    async (req, res) => {
        let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
        let check = true;

        try {

            const isValidDecimal = (value) => !isNaN(value) && !isNaN(parseFloat(value));

            if (page && !isValidDecimal(page)) check = false;
            if (size && !isValidDecimal(size)) check = false;
            if (minLat && (!isValidDecimal(minLat) || minLat < -90)) check = false;
            if (maxLat && (!isValidDecimal(maxLat) || maxLat > 90)) check = false;
            if (minLng && (!isValidDecimal(minLng) || minLng < -180)) check = false;
            if (maxLng && (!isValidDecimal(maxLng) || maxLng > 180)) check = false;
            if (minPrice && (!isValidDecimal(minPrice) || minPrice < 0)) check = false;
            if (maxPrice && (!isValidDecimal(maxPrice) || maxPrice < 0)) check = false;
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

            let pageNum = parseInt(page) || 1;
            let sizeNum = parseInt(size) || 20
            if (sizeNum > 20) sizeNum = 20;

            // if (minLat) minLat = minLat ? parseFloat(minLat) : null;
            // if (maxLat) maxLat = maxLat ? parseFloat(maxLat) : null;
            // if (minLng) minLng = minLng ? parseFloat(minLng) : null;
            // if (maxLng) maxLng = maxLng ? parseFloat(maxLng) : null;
            // if (minPrice) minPrice = minPrice ? parseFloat(minPrice) : null;
            // if (maxPrice) maxPrice = maxPrice ? parseFloat(maxPrice) : null;
            minLat = minLat ? parseFloat(minLat) : null;
            maxLat = maxLat ? parseFloat(maxLat) : null;
            minLng = minLng ? parseFloat(minLng) : null;
            maxLng = maxLng ? parseFloat(maxLng) : null;
            minPrice = minPrice ? parseFloat(minPrice) : null;
            maxPrice = maxPrice ? parseFloat(maxPrice) : null;

            const where = {};
            if (minLat && maxLat) {
                where.lat = { [Op.between]: [minLat, maxLat] }
            } else if (minLat) {
                where.lat = { [Op.between]: [minLat, 90] }
            } else if (maxLat) {
                where.lat = { [Op.between]: [-90, maxLat] }
            }

            if (minLng && maxLng) {
                where.lng = { [Op.between]: [minLng, maxLng] }
            } else if (minLng) {
                where.lng = { [Op.between]: [minLng, 180] }
            } else if (maxLng) {
                where.lng = { [Op.between]: [-180, maxLng] }
            }

            if (minPrice && maxPrice) {
                where.price = { [Op.between]: [minPrice, maxPrice] }
            } else if (minPrice) {
                where.price = { [Op.gte]: [minPrice] }
            } else if (maxPrice) {
                where.price = { [Op.lte]: [maxPrice] }
            }

            const allSpots = await Spot.findAll({
                where,
                limit: sizeNum,
                offset: (pageNum - 1) * sizeNum
            });

            if (!allSpots || allSpots.length <= 0) {
                return res.status(400).json({ message: "There is no Spot in the system" })
            }

            // Map through all the spots and format their createdAt and updatedAt
            const formattedSpots = allSpots.map(spot => {
                // Format the createdAt and updatedAt for each spot
                const formattedCreatedAt = spot.createdAt.toISOString().replace('T', ' ').slice(0, 19);
                const formattedUpdatedAt = spot.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

                // Return a new object with the formatted dates
                return {
                    ...spot.toJSON(),
                    price: Number(spot.price),
                    createdAt: formattedCreatedAt,
                    updatedAt: formattedUpdatedAt,
                };
            });

            const displaySpots = {
                Spots: formattedSpots
            }

            displaySpots.page = pageNum;
            displaySpots.size = sizeNum;

            return res.status(200).json(displaySpots);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred while getting all Spots" })
        }
    }   
)

// GET all Spots
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
                const formattedCreatedAt = spot.createdAt.toISOString().replace('T', ' ').slice(0, 19);
                const formattedUpdatedAt = spot.updatedAt.toISOString().replace('T', ' ').slice(0, 19);

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