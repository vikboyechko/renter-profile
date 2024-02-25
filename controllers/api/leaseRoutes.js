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

// Update a lease
router.put('/update/:id', async (req, res) => {
    try {
        const leaseId = req.params.id;
        const { start_date, end_date, rent_amount, rent_bedrooms, square_footage } = req.body;

        const leaseData = await Leases.findByPk(leaseId);

        if (!leaseData) {
            return res.status(404).json({ message: 'No lease found with this id!' });
        }

        leaseData.start_date = start_date;
        leaseData.end_date = end_date;
        leaseData.rent_amount = rent_amount;
        leaseData.rent_bedrooms = rent_bedrooms;
        leaseData.square_footage = square_footage;

        // leaseData.property_id = property_id;
        // leaseData.renter_id = renter_id;

        await leaseData.save();

        res.status(200).json({ message: 'Lease updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update lease', error: err.message });
    }
});

module.exports = router;
