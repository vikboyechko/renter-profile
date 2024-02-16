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
        const propertyId = req.params.id;
        const { name, address1, address2, city, state, zip } = req.body;

        const propertyData = await Property.findByPk(propertyId);

        if (!propertyData) {
            res.status(404).json({ message: 'No property found with this id!' });
            return;
        }

        propertyData.name = name;
        propertyData.address1 = address1;
        propertyData.address2 = address2;
        propertyData.city = city;
        propertyData.state = state;
        propertyData.zip = zip;
        propertyData.date_created = new Date();

        await propertyData.save();

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
