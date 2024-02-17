const sequelize = require('../config/connection');
const { User, Property, Review, Lease } = require('../models');

const userData = require('./userData.json');
const propertyData = require('./propertyData.json');
const reviewData = require('./reviewData.json');
const leaseData = require('./leaseData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    // Bulk create users with individual hooks to handle password hashing, etc.
    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    // bulk create properties, reviews, and leases
    await Property.bulkCreate(propertyData);
    await Review.bulkCreate(reviewData);
    await Lease.bulkCreate(leaseData);

    console.log('Database seeded!');
    process.exit(0);
};

seedDatabase();
