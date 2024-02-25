const router = require('express').Router();
const { Reviews, Users, Properties, Leases } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const { content, rating, reviewee_id, reviewee_type, property_id } = req.body;

        // make sure the reviewer exists
        const reviewerExists = await Users.findByPk(req.session.user_id);
        if (!reviewerExists) {
            return res.status(404).json({ message: 'Reviewer not found' });
        }

        let reviewData = {
            content,
            rating,
            reviewer_id: req.session.user_id,
            reviewee_type,
            isPublished: true,
        };

        // Assign reviewee_id or property_id based on reviewee_type
        if (reviewee_type === 'user') {
            reviewData.reviewee_id = reviewee_id;
        } else if (reviewee_type === 'property') {
            reviewData.property_id = property_id;
        } else {
            return res.status(400).json({ message: 'Invalid reviewee_type' });
        }

        const newReview = await Reviews.create(reviewData);
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

// Update a review
router.put('/update/:id', async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { content, rating, is_published, reviewee_id, property_id, reviewee_type } = req.body;

        const reviewData = await Reviews.findByPk(reviewId);

        if (!reviewData) {
            return res.status(404).json({ message: 'No review found with this id!' });
        }

        reviewData.content = content;
        reviewData.rating = rating;
        reviewData.is_published = is_published;
        reviewData.reviewee_id = reviewee_id;
        reviewData.property_id = property_id;
        reviewData.reviewee_type = reviewee_type;

        await reviewData.save();

        res.status(200).json({ message: 'Review updated successfully' });
    } catch (err) {
        console.error(err); //
        res.status(500).json({ message: 'Failed to update review', error: err.message });
    }
});

module.exports = router;
