// Required CRUD
const express = require('express')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Bounty } = require('../../db/models');
const { Comment } = require('../../db/models');
const { Sequelize } = require('../../db/models');

const validateBounty = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Title is required')
        .isLength({ max: 50 })
        .withMessage('Title cannot be more than 50 characters long'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Description cannot be more than 500 characters long'),
    handleValidationErrors
]

//Get All Bounties (Read)
router.get(
    '/',
    // queryValidation,
    async(req, res, next) => {
        try {
        // const response = {
        //     id,
        //     title,
        //     description,
        //     userId
        // }
        // return res.status(201).json(response)

        // const bounties = await Bounty.findAll()
        const bounties = await Bounty.findAll({
            include: [
                {
                    model: Comment,
                    attributes: [] // Don't include actual comment data, just the count
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('Comments.id')), 'commentsCount'] // Add the count of comments
                ]
            },
            group: ['Bounty.id'] // Group by Bounty ID to aggregate the count
        });
        console.log("BOUNTIES IN API", bounties)

        // const bounties = await Bounty.findAll({
        //     attributes: { exclude: ['bountyId'] } // WHY DO I NEED TO EXCLUDE BOUNTYID?????
        //   });
        // console.log("bounties", bounties)
        return res.status(201).json(bounties)
        } catch (error) {
            next(error)
        }
    }
)

//Create a Bounty (Create)
router.post(
    '/',
    requireAuth, // Middleware to ensure user is logged in
    validateBounty,
    async (req, res, next) => {
        try {
            const { title, description } = req.body;
            const userId = req.user.id; // Assuming req.user contains the logged-in user's details

            // Create new Bounty
            const newBounty = await Bounty.create({
                title,
                description,
                userId
            });

            return res.status(201).json(newBounty);
        } catch (error) {
            next(error);
        }
    }
);

// Update a Bounty (Update)
router.put(
    '/:bountyId', 
    requireAuth, // Require user to be logged in
    validateBounty, // Apply validation
    async (req, res, next) => {
        try {
            console.log("IS THIS WORKING")
            const { title, description } = req.body;
            const bountyId = req.params.bountyId; // Use req.params.bountyId
            const userId = req.user.id;

            // Find the bounty by ID
            const bounty = await Bounty.findByPk(bountyId);
            console.log("BOUNTY IN API ONE", bounty)

            if (!bounty) {
                return res.status(404).json({ message: "Bounty not found." });
            }

            // Check if the current user is the owner of the bounty
            if (bounty.userId !== userId) {
                return res.status(403).json({ message: "You are not authorized to update this bounty." });
            }

            // Update the bounty
            await bounty.update({
                title,
                description
            });
            console.log("BOUNTY IN API", bounty)
            return res.status(200).json(bounty);
        } catch (error) {
            next(error);
        }
    }
);

// Delete a Bounty (Delete)
router.delete(
    '/:bountyId', 
    requireAuth, // Require user to be logged in
    async (req, res, next) => {
        try {
            console.log("Attempting to delete bounty with ID:", req.params.bountyId);
            console.log("User ID performing the delete:", req.user.id);
            const bountyId = req.params.bountyId; // Use req.params.bountyId
            const userId = req.user.id;

            // Find the bounty by ID
            const bounty = await Bounty.findByPk(bountyId);
            if (!bounty) {
                return res.status(404).json({ message: "Bounty not found." });
            }
            // Check if the current user is the owner of the bounty
            if (bounty.userId !== userId) {
                return res.status(403).json({ message: "You are not authorized to delete this bounty." });
            }
            //grab CompletedBounty and Comment to be deleted
            const { CompletedBounty, Comment } = require('../../db/models'); 
            await CompletedBounty.destroy({
                where: {bountyId}
            })
            await Comment.destroy({
                where: {bountyId}
            })
            // Delete the bounty
            await bounty.destroy();

            return res.status(200).json({ message: "Bounty successfully deleted." });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;