const router = require('express').Router();
// Import the Property model from the models folder
const { Property } = require('../../models');

// If a POST request is made to /api/properties, a new property address is created. If there is an error, the function returns with a 400 error.
router.post('/', async (req, res) => {
    try {
        const newProperty = await Property.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newProperty);
    } catch (err) {
        res.status(400).json(err);
    }
});

// If a DELETE request is made to /api/properties/:id, that project is deleted.
router.delete('/:id', async (req, res) => {
    try {
        const propertyData = await Property.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!propertyData) {
            res.status(404).json({ message: 'No property found with this id!' });
            return;
        }

        res.status(200).json(propertyData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// If a PUT request is made to /api/properties/edit/:id, that property is updated.
router.put('/update/:id', async (req, res) => {
    try {
        const propertyUpdate = await Property.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        // If the property is not found at the id, or the user does not have permission to update the property, return a 404 error.
        if (propertyUpdate[0] === 0) {
            res.status(404).json({
                message: 'No property found with this id, or you do not have permission to update this property.',
            });
            return;
        }

        res.status(200).json({ message: 'Property updated successfully' });

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
