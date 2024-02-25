const router = require('express').Router();
const { Users, Properties, Reviews, Leases, Documents } = require('../models');
const withAuth = require('../utils/auth'); // custom helper for authentication

// GET all properties for homepage
router.get('/', async (req, res) => {
    try {
        const propertyData = await Properties.findAll({
            include: [
                {
                    model: Users,
                    attributes: ['name', 'email', 'phone'],
                },
                {
                    model: Reviews,
                    attributes: ['content', 'rating', 'created_at'],
                    as: 'reviews',
                },
                {
                    model: Documents,
                    as: 'PropertyDocuments',
                    attributes: ['link'],
                    where: {
                        type: 'property_image',
                    },
                    required: false, //
                },
            ],
        });
        // Serialize data so the template can read it
        const properties = propertyData.map((property) => property.get({ plain: true }));

        // Get renters (users with the role of "renter")
        const renterData = await Users.findAll({
            where: { role: 'renter' },
            attributes: ['name', 'email', 'phone'],
        });
        const renters = renterData.map((renter) => renter.get({ plain: true }));

        // Pass serialized data and session flag into template
        res.render('homepage', {
            properties,
            renters,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET one renter with their reviews and rental history
router.get('/renters/:id', async (req, res) => {
    try {
        const renterData = await Users.findByPk(req.params.id, {
            include: [
                {
                    model: Properties,
                    as: 'UserRentals',
                    attributes: ['id', 'name', 'address1', 'address2', 'city', 'state', 'zip'], // property's address
                    include: [
                        {
                            model: Leases,
                            attributes: ['start_date', 'end_date', 'rent_amount', 'square_footage', 'rent_bedrooms'],
                            as: 'leases',
                        },
                        {
                            model: Reviews,
                            as: 'reviews',
                        },
                        {
                            model: Documents,
                            as: 'PropertyDocuments',
                            attributes: ['link'],
                            where: {
                                type: 'property_image',
                            },
                            required: false, //
                        },
                    ],
                },
                {
                    model: Reviews,
                    as: 'ReceivedReviews',
                    include: [
                        {
                            model: Users,
                            as: 'Reviewer',
                            attributes: ['name'], // reviewer's name
                        },
                    ],
                    attributes: ['content', 'rating', 'created_at'], // review's rating, content, and creation date
                },
            ],
        });

        if (!renterData) {
            res.status(404).send('Renter not found');
            return;
        }

        const renter = renterData.get({ plain: true });

        // passes the serialized data into the template
        // res.json(renter);
        res.render('renter', {
            ...renter, // include the property details, manager info, reviews, and renters
            logged_in: req.session.logged_in,
            user_id: req.session.user_id,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET one property with its reviews and renters
router.get('/properties/:id', async (req, res) => {
    try {
        const propertyData = await Properties.findByPk(req.params.id, {
            include: [
                {
                    model: Users,
                    attributes: ['name', 'email', 'phone'], // property manager's name, email, and phone
                },
                {
                    model: Reviews,
                    as: 'reviews',
                    include: [
                        {
                            model: Users,
                            as: 'Reviewer',
                            attributes: ['name'], // reviewer's name
                        },
                    ],
                    attributes: ['content', 'created_at'], // review's rating, content, and creation date
                },
                {
                    model: Leases,
                    as: 'leases',
                    include: [
                        {
                            model: Users,
                            as: 'renter',
                            attributes: ['name'], // renter's name
                        },
                    ],
                    attributes: ['start_date', 'end_date', 'rent_amount'], // lease's start and end date
                },
            ],
        });

        if (!propertyData) {
            res.status(404).send('Property not found');
            return;
        }

        // Get property images
        const propertyImages = await Documents.findAll({
            where: {
                property_id: req.params.id,
                type: 'property_image', // this is to make sure it's the property image and not the property managers profile pic
            },
            attributes: ['link'], //
        });

        const property = propertyData.get({ plain: true });
        const images = propertyImages.map((image) => image.get({ plain: true }));

        // passes the serialized data into the template
        res.render('property', {
            ...property, // include the property details, manager info, reviews, and renters
            images,
            logged_in: req.session.logged_in,
            user_id: req.session.user_id,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Use withAuth helper to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID
        const userData = await Users.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Properties,
                    as: 'UserRentals',
                    include: [
                        {
                            model: Reviews,
                            as: 'reviews',
                        },
                        {
                            model: Leases,
                            as: 'leases',
                        },
                        {
                            model: Documents,
                            as: 'PropertyDocuments',
                            attributes: ['link'],
                            where: {
                                type: 'property_image',
                            },
                            required: false, //
                        },
                    ],
                },
                { model: Reviews, as: 'WrittenReviews' },
                { model: Reviews, as: 'ReceivedReviews' },
                { model: Leases, as: 'rentals' },
                { model: Documents, as: 'UserDocuments' },
            ],
        });
        console.log(userData.get({ plain: true }));
        // console.log(user);

        const user = userData.get({ plain: true });

        // Lease for each UserRentals
        user.UserRentals.forEach((rental) => {
            const lease = user.rentals.find((lease) => lease.property_id === rental.id);
            if (lease) {
                rental.leaseStartDate = lease.startDate;
                rental.leaseEndDate = lease.endDate;
                rental.rentAmount = lease.rent_amount;
                rental.squareFootage = lease.square_footage;
                rental.bedrooms = lease.rent_bedrooms;
            }
            // the review written by the user for the current rental property
            const review = user.WrittenReviews.find(
                (review) => review.reviewee_id === rental.id && review.reviewee_type === 'property'
            );
            if (review) {
                rental.reviewContent = review.content;
                rental.reviewRating = review.rating;
            }
        });

        // profile picture link
        const userProfilePic = user.UserDocuments.find((doc) => doc.type === 'profile_pic');
        const profilePicLink = userProfilePic ? userProfilePic.link : '/images/users/default.jpg';

        res.render('dashboard', {
            ...user,
            profilePicLink,
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
        const propertyData = await Properties.findByPk(req.params.id, {
            include: [
                {
                    model: Users,
                    attributes: ['name'],
                },
                { model: Leases, as: 'leases' },
                { model: Reviews, as: 'reviews' },
            ],
        });
        const property = propertyData.get({ plain: true });
        const propertyUser = property.user_id;
        const reqPropertyUser = req.session.user_id;
        if (propertyUser !== reqPropertyUser) {
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

module.exports = router;
