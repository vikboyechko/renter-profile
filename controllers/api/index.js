const router = require('express').Router();
// Import the routes. This is how we make our routes modular.
const userRoutes = require('./userRoutes');
const propertyRoutes = require('./propertyRoutes');
const reviewRoutes = require('./reviewRoutes');

// When a request is made to the /users or /properties or /reviews path, it will be directed to the index.js in the /api folder.
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/reviews', reviewRoutes);

// general error handling after all other route middleware:
router.use((err, req, res, next) => {
    console.error(err.stack); // Log error "stack" for easier debugging
    res.status(500).json({ message: 'Something went wrong on the server.' });
});

module.exports = router;
