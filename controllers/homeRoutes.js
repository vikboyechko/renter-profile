const router = require('express').Router();
const { User, Property, Review, Lease } = require('../models');
const withAuth = require('../utils/auth'); // custom helper for authentication

// GET all properties for homepage
router.get('/', async (req, res) => {
    try {
        const propertyData = await Property.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
                {
                    model: Review,
                    attributes: ['content', 'created_at'],
                },
            ],

        });
        // Serialize data so the template can read it
        const properties = propertyData.map((property) => property.get({ plain: true }));

        // Pass serialized data and session flag into template
        res.render('homepage', {

            properties,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET one property with its reviews and leases
======

// GET one property
router.get('/properties/:id', async (req, res) => {
    try {
        const propertyData = await Property.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
                {
                    model: Review,
                    include: [
                        {
                            model: User,
                            attributes: ['name'],
                        },
                    ],
                },

                {
                    model: Lease,
                    attributes: ['startDate', 'endDate', 'rent_amount'],
                    include: [{ model: User, attributes: ['name'] }],
                },

            ],
        });

        const property = propertyData.get({ plain: true });

        // adds a new isAuthor property to the property object, so if the logged-in user is the property address author, they can see the edit and delete buttons
        property.isAuthor = req.session.user_id === property.user_id;

        // passes the serialized data into the session flag, along with the logged-in user's id and the isAuthor property
        res.render('property', {
            ...property,
            logged_in: req.session.logged_in,
            user_id: req.session.user_id,
            isAuthor: property.isAuthor,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Use withAuth helper to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Property }],
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('login');
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const propertyData = await Property.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
        const property = propertyId.get({ plain: true });


        if (!(property.user_id === req.session.user_id)) {

        const propertyUser = property.user_id;
        const reqPropertyUser = req.session.user_id;
        if (!(propertyUser === reqPropertyUser)) {

            res.redirect('/dashboard');
            return;
        }
        res.render('edit', {
            ...property,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// General catch-all route for 404 errors.
router.use((req, res) => {
    res.status(404).send('Page not found');
});

module.exports = router;
