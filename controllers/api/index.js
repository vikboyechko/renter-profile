const router = require('express').Router();
// Import the routes. This is how we make our routes modular.
const userRoutes = require('./userRoutes');
const propertyRoutes = require('./propertyRoutes');
const reviewRoutes = require('./reviewRoutes');
const leaseRoutes = require('./leaseRoutes');

// When a request is made to the /users or /properties or /reviews path, it will be directed to the index.js in the /api folder.
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/reviews', reviewRoutes);
router.use('/leases', leaseRoutes);

module.exports = router;
