const router = require('express').Router();
// Import the User model from the models folder
const { Users } = require('../../models');

// If a POST request is made to /api/users, a new user is created. The user id and logged in state is saved to the session within the request object.
router.post('/', async (req, res) => {
    console.log('req.body:', req.body);
    try {
        const userData = await Users.create(req.body);
        // console.log('userData:', userData);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

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

module.exports = router;
