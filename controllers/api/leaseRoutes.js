const router = require('express').Router();
const { Leases, Properties, Users } = require('../../models');

// Post new lease data
router.post('/', async (req, res) => {
    try {
        // Extract relevant information from request body
        const { start_date, end_date, rent_amount, rent_bedrooms, square_footage, property_id, renter_id } = req.body;

        // Create a new lease record in the database
        const newLease = await Leases.create({
            start_date,
            end_date,
            rent_amount,
            rent_bedrooms,
            square_footage,
            property_id,
            renter_id,
        });

        res.status(200).json(newLease);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json(err);
    }
});

// Additional routes for updating, fetching, and deleting leases can go here

module.exports = router;
