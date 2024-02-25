const router = require('express').Router();
const { Reviews, Users, Properties, Leases } = require('../../models');

router.post('/', async (req, res) => {
    try {
        // destructuring the content, rating, reviewee_id, and reviewee_type properties off of req.body
        const { content, rating, reviewee_id, reviewee_type } = req.body;

        // create a new review with the user_id and property_id
        const newReview = await Reviews.create({
            content,
            rating,
            reviewee_id,
            reviewee_type,
            reviewer_id: req.session.user_id,
        });

        res.status(200).json(newReview);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Get all reviews for a property
router.get('/property/:propertyId', async (req, res) => {
    try {
        const reviews = await Reviews.findAll({
            where: { property_id: req.params.propertyId },
            include: [{ model: Users }],
        });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a single review by ID
router.get('/:id', async (req, res) => {
    try {
        const review = await Reviews.findByPk(req.params.id);
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
