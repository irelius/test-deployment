const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { SpotImage, Spot, User, Review, ReviewImage } = require('../../db/models');
const Spots = require('../../db/seeders/2-spots');

const router = express.Router();

const validateNewSpot = [
    check('address').exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city').exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state').exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country').exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat').isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng').isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name').exists({ checkFalsy: true }).isLength({ max: 49 })
        .withMessage('Name must be less than 50 characters'),
    check('description').exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price').isFloat({ min: 0.01 })                   // #TODO Needs work
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

const validateReview = [
    check('review').exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars').isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

// Add Image based on Spot ID
router.post("/:spotId/images", async (req, res, next) => {
    const { user } = req;
    if (user) {
        const spotId = req.params.spotId;
        const spotInfo = await Spot.findByPk(spotId);
        if (spotInfo) {
            if (user.id === spotInfo.ownerId) {
                const { url, preview } = req.body;

                //Create the image
                const newImage = await SpotImage.create({
                    url,
                    preview,
                    spotId: spotId
                });

                // Return the created image
                res.statusCode = 201;
                return res.json(newImage);      // #TODO get rid of created and updated in response
            } else {
                res.statusCode = 403;
                res.json({ message: "Forbidden: Spot must belong to the current user" })
            }
        } else {
            res.statusCode = 404;
            res.json({ message: "Spot couldn't be found" })
        }
    } else {
        res.statusCode = 401;
        return res.json({ message: "Authentication required" });
    }
});

// Create a new Review
router.post("/:spotId/reviews", validateReview, async (req, res, next) => {
    const { user } = req;
    if (user) {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);
        if (spot) {
            const repeatReview = await Review.findAll({
                where: {
                    userId: user.id,
                    spotId: spotId
                }
            });
            if (repeatReview.length === 0) {
                const { review, stars } = req.body;
                const newReview = await Review.create({
                    userId: user.id,
                    spotId: spotId,
                    review: review,
                    stars: stars
                });
                res.statusCode = 201;
                return res.json(newReview);
            } else {
                res.statusCode = 500;
                return res.json({ message: "User already has a review for this spot" });
            }
        } else {
            res.statusCode = 404;
            return res.json({ message: "Spot couldn't be found" })
        }
    } else {
        res.statusCode = 401;
        return res.json({ message: "Authentication required" });
    }
});

// Create a new Spot
router.post("/", validateNewSpot, async (req, res, next) => {
    const { user } = req;
    if (user) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.create({
            ownerId: user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        });
        res.statusCode = 201;
        return res.json(spot);
    } else {
        res.statusCode = 401;
        return res.json({ message: "Authentication required" });
    }
});

// Get all Reviews by Spot ID
router.get("/:spotId/reviews", async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (spot) {
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            // attributes: {
            //   exclude: ['UserId', 'SpotId']
            // },
            include: [
                {
                    model: User,
                    attributes: [
                        'id',
                        'firstName',
                        'lastName'
                    ]
                },
                {
                    model: ReviewImage,
                    attributes: [
                        'id',
                        'url'
                    ]
                }
            ]
        });
        return res.json({ Reviews: reviews });
    } else {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found" });
    }
});

// Get all Spots from Current User
router.get("/current", async (req, res, next) => {
    const { user } = req;
    if (user) {
        const spots = await Spot.findAll({
            where: {
                ownerId: user.id
            }
        });
        const spotsRes = [];
        for (let i = 0; i < spots.length; i++) {
            const reviews = await Review.findAll({
                where: {
                    spotId: spots[i].id,
                },
                // attributes: {
                //   exclude: ['UserId', 'SpotId']
                // }
            });
            let avgStars;
            if (reviews.length !== 0) {
                avgStars = reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
            } else {
                avgStars = 'No Reviews';
            }
            const spotImages = await SpotImage.findAll({
                where: {
                    spotId: spots[i].id,
                    preview: true
                }
            });
            let previewUrl
            if (spotImages.length !== 0) {
                previewUrl = spotImages[0].url;
            } else {
                previewUrl = 'No Preview Image'
            }
            spotsRes[i] = {
                id: spots[i].id,
                ownerId: spots[i].ownerId,
                address: spots[i].address,
                city: spots[i].city,
                state: spots[i].state,
                country: spots[i].country,
                lat: spots[i].lat,
                lng: spots[i].lng,
                name: spots[i].name,
                description: spots[i].description,
                price: spots[i].price,
                createdAt: spots[i].createdAt,
                updatedAt: spots[i].updatedAt,
                avgRating: avgStars,
                previewImage: previewUrl
            }
        }
        return res.json({ Spots: spotsRes });
    } else {
        res.statusCode = 401;
        return res.json({ message: "Authentication required" });
    }
});

// Get Spot by ID
router.get("/:spotId", async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot) {
        const user = await User.findByPk(spot.ownerId);
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id,
            },
            // attributes: {
            //   exclude: ['UserId', 'SpotId']
            // }
        });
        let avgStars;
        if (reviews.length !== 0) {
            avgStars = reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
        } else {
            avgStars = 'No Reviews';
        }
        const spotImages = await SpotImage.findAll({
            where: {
                spotId: spot.id,
            }
        });
        let spotImagesRes;
        if (spotImages.length !== 0) {
            spotImagesRes = [];
            for (let i = 0; i < spotImages.length; i++) {
                spotImagesRes[i] = {
                    id: spotImages[i].id,
                    url: spotImages[i].url,
                    preview: spotImages[i].preview,
                }
            }
        } else {
            spotImagesRes = 'No Images'
        }
        let firstN;
        let lastN;
        if (user.firstName === null) {
            firstN = 'No name given';
        } else {
            firstN = user.firstName;
        }
        if (user.lastName === null) {
            lastN = 'No name given';
        } else {
            lastN = user.lastName;
        }
        return res.json({
            id: spot.id,                                // #TODO come back for error, try to get will
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: reviews.length,
            avgStarRating: avgStars,
            SpotImages: spotImagesRes,
            Owner: {
                id: user.id,
                firstName: firstN,
                lastName: lastN
            }
        });
    } else {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found" })
    }
})

//Edit a Spot
router.put("/:spotId", validateNewSpot, async (req, res, next) => {
    const { user } = req;
    if (user) {
        const spotId = req.params.spotId;
        const spotInfo = await Spot.findByPk(spotId);
        // Check if the spot exists
        if (spotInfo) {
            if (user.id === spotInfo.ownerId) {
                const { address, city, state, country, lat, lng, name, description, price } = req.body;
                const updatedSpot = await spotInfo.update({
                    address,
                    city,
                    state,
                    country,
                    lat,
                    lng,
                    name,
                    description,
                    price,
                });
                return res.json(updatedSpot);
            } else {
                res.statusCode = 403;
                res.json({ message: "Forbidden: Spot must belong to the current user" })
            }
        } else {
            res.statusCode = 404;
            res.json({ message: "Spot couldn't be found" })
        }
    } else {
        res.statusCode = 401;
        return res.json({ message: "Authentication required" });
    }
});

//Delete a Spot
router.delete("/:spotId", async (req, res, next) => {
    const { user } = req;
    if (user) {
        const spotId = req.params.spotId;
        const spotInfo = await Spot.findByPk(spotId);  // #TODO change spotInfo to spot for clarity

        if (spotInfo) {
            if (user.id === spotInfo.ownerId) {
                await spotInfo.destroy();
                return res.json({ message: "Successfully deleted" });
            } else {
                res.statusCode = 403;
                res.json({ message: "Forbidden: Spot must belong to the current user" })
            }
        } else {
            res.statusCode = 404;
            res.json({ message: "Spot couldn't be found" })
        }
    } else {
        res.statusCode = 401;
        return res.json({ message: "Authentication required" });
    }
});

router.get('/test', async (req, res, next) => {
    const data = await Spots.findAll();

    return res.json(data)
})

// Get all Spots
router.get("/", async (req, res, next) => {

    const errors = {};

    // Validate 'page'
    let page;
    if (req.query.page === undefined) {
        page = 1;
    } else {
        page = parseInt(req.query.page);
    }
    if (isNaN(page) || page < 1) {
        errors.page = "Page must be greater than or equal to 1";
    }

    // Validate 'size'
    let size;
    if (req.query.size === undefined) {
        size = 20;
    } else {
        size = parseInt(req.query.size);
    }
    if (isNaN(size) || size < 1 || size > 20) {
        errors.size = "Size must be between 1 and 20";
    }

    // Helper function to validate and parse float
    function parseFloatOrUndefined(value, varName, errorSen) {
        if (value === undefined) return undefined;
        let parsed = parseFloat(value);
        if (isNaN(parsed)) errors[varName] = errorSen;
        return isNaN(parsed) ? undefined : parsed;
    }

    // Validate and parse lat, lng, price
    let minLat = parseFloatOrUndefined(req.query.minLat, 'minLat', 'Minimum latitude is invalid');
    let maxLat = parseFloatOrUndefined(req.query.maxLat, 'maxLat', 'Maximum latitude is invalid');
    let minLng = parseFloatOrUndefined(req.query.minLng, 'minLng', 'Minimum longitude is invalid');
    let maxLng = parseFloatOrUndefined(req.query.maxLng, 'maxLng', 'Maximum longitude is invalid');
    let minPrice = parseFloatOrUndefined(req.query.minPrice, 'minPrice', 'Minimum price must be greater than or equal to 0');
    let maxPrice = parseFloatOrUndefined(req.query.maxPrice, 'maxPrice', 'Maximum price must be greater than or equal to 0');

    // If there are validation errors, return a 400 response
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors,
        });
    }

    // Build the 'where' clause for Sequelize
    let where = {};

    if (minLat !== undefined) where.lat = { ...where.lat, [Op.gte]: minLat };
    if (maxLat !== undefined) where.lat = { ...where.lat, [Op.lte]: maxLat };
    if (minLng !== undefined) where.lng = { ...where.lng, [Op.gte]: minLng };
    if (maxLng !== undefined) where.lng = { ...where.lng, [Op.lte]: maxLng };
    if (minPrice !== undefined) where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice !== undefined) where.price = { ...where.price, [Op.lte]: maxPrice };

    // Set limit and offset for pagination
    const limit = size;
    const offset = (page - 1) * size;

    const spots = await Spot.findAll({
        where,
        limit,
        offset
    });
    const spotsRes = [];
    for (let i = 0; i < spots.length; i++) {
        const reviews = await Review.findAll({
            where: {
                spotId: spots[i].id,
            },
            attributes: {
              exclude: ['UserId', 'SpotId']
            }
        });
        let avgStars;
        if (reviews.length !== 0) {
            avgStars = reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
        } else {
            avgStars = 'No Reviews';
        }
        const spotImages = await SpotImage.findAll({
            where: {
                spotId: spots[i].id,
                preview: true
            }
        });
        let previewUrl
        if (spotImages.length !== 0) {
            previewUrl = spotImages[0].url;
        } else {
            previewUrl = 'No Preview Image'
        }
        spotsRes[i] = {
            id: spots[i].id,
            ownerId: spots[i].ownerId,
            address: spots[i].address,
            city: spots[i].city,
            state: spots[i].state,
            country: spots[i].country,
            lat: spots[i].lat,
            lng: spots[i].lng,
            name: spots[i].name,
            description: spots[i].description,
            price: spots[i].price,
            createdAt: spots[i].createdAt,
            updatedAt: spots[i].updatedAt,
            avgRating: avgStars,
            previewImage: previewUrl
        }
    }
    return res.json({
        Spots: spotsRes,
        page,
        size
    });
});

module.exports = router;
