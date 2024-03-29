const router = require('express').Router();
// Import the User model from the models folder
const { Users, Documents } = require('../../models');

// Email module
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// If a POST request is made to /api/users, a new user is created. The user id and logged in state is saved to the session within the request object.
router.post('/', async (req, res) => {
    console.log('req.body:', req.body);
    try {
        const userData = await Users.create(req.body);
        // console.log('userData:', userData);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            // when a person signs up, they get a welcome email
            const mailinfo = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject: 'Welcome to Renterly!',
                text: `Hello ${req.body.name}, welcome to the team!`,
            };

            transporter.sendMail(mailinfo, function (err, info) {
                if (err) {
                    console.log('Error:', err);
                } else {
                    console.log('Info:', info);
                }
            });

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// If a POST request is made to /api/users/login, the function checks to see if the user information matches the information in the database and logs the user in. If correct, the user ID and logged-in state are saved to the session within the request object.
router.post('/login', async (req, res) => {
    console.log('req.body:', req.body);
    try {
        const userData = await Users.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are now logged in!' });
        });
    } catch (err) {
        console.log('err:', err);
        res.status(400).json(err);
    }
});

// If a POST request is made to /api/users/logout, the function checks the logged_in state in the request.session object and destroys that session if logged_in is true.
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// If a PUT request is made to /api/users/:id, that user is updated.
router.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, phone } = req.body;

        const userData = await Users.findByPk(userId);

        console.log(JSON.stringify({ userData }));

        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }

        userData.name = name;
        userData.email = email;
        userData.phone = phone;

        console.log('userData:', userData);
        await userData.save();

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Endpoint to add a new profile picture document
router.post('/:userId/profile-picture', async (req, res) => {
    const userId = req.params.userId;
    const { profileImageUrl } = req.body;

    try {
        const newDocument = await Documents.create({
            user_id: userId,
            link: profileImageUrl,
            type: 'profile_pic', // Assuming you have a type field to distinguish document types
        });
        res.json({ message: 'Profile image added successfully', document: newDocument });
    } catch (error) {
        console.error('Failed to add profile image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
