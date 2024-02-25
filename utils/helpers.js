// Helper functions for formatting dates and checking if a user can edit a post.

module.exports = {
    format_date: (date) => {
        // Format date as MM/DD/YYYY
        const options = { month: 'numeric', day: '2-digit', year: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
    },

    ifUserCanEdit: (user, sessionUser, options) => {
        // used for comparing the post's user_id to the session's user_id
        if (user.id === sessionUser.id) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },

    average_rating: (ratings) => {
        if (ratings && ratings.length) {
            const sum = ratings.reduce((acc, { rating }) => acc + rating, 0);
            const average = sum / ratings.length;
            const roundedAverage = Math.round(average);
            return `/images/ratings/${roundedAverage}.jpg`;
        }
        return '/images/ratings/default.jpg';
    },

    format_date_to_input: (date) => {
        if (!date) return ''; // Handle null or undefined dates

        const d = new Date(date);
        let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },

    json: function (context) {
        return JSON.stringify(context);
    },
};
