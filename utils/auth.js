// Custom withAuth middlware helper function to check if the user is logged in. If the user is not logged in, the request is redirected to the login route. If the user is logged in, the request proceeds as planned.

const withAuth = (req, res, next) => {
    // If the user is not logged in, redirect the request to the login route
    if (!req.session.logged_in) {
        res.redirect('/login');
        console.log('-- Not logged in yet - Redirecting to /login --');
    } else {
        next();
        console.log('-- Logged in - Continuing to next route --');
    }
};

module.exports = withAuth;
