const sequelize = require('../config/connection');
const { Users, Properties, Reviews, Leases } = require('../models');

const userData = require('./usersData.json');
const propertyData = require('./propertiesData.json');
const reviewData = require('./reviewsData.json');
const leaseData = require('./leasesData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    // Bulk create users with individual hooks to handle password hashing, etc.
    await Users.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    // bulk create properties, reviews, and leases
    await Properties.bulkCreate(propertyData);
    await Reviews.bulkCreate(reviewData);
    await Leases.bulkCreate(leaseData);

    console.log('Database seeded!');
    process.exit(0);
};

seedDatabase();
