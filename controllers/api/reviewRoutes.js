const router = require('express').Router();
const { Review } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const newReview = await Review.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newReview);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Get all reviews for a property
router.get('/property/:propertyId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { property_id: req.params.propertyId },
            // Include any related models here, such as the User model to show review author details
        });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a single review by ID
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            res.status(404).json({ message: 'No review found with this id!' });
            return;
        }
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
