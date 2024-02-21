// Import just the router express
const router = require('express').Router();

// Import the routes. This is how we make our routes modular.
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;
