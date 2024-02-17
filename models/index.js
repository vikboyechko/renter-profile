const User = require('./User');
const Property = require('./Property');
const Review = require('./Review');
const Lease = require('./Lease');

// User and Property associations
User.hasMany(Property, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});
Property.belongsTo(User, {
    foreignKey: 'user_id',
});

// User and Review associations for reviews written by the user
// Later can be used to access all reviews written by a user using the alias 'WrittenReviews' e.g. User.findAll({ include: 'WrittenReviews' })

User.hasMany(Review, {
    as: 'WrittenReviews',
    foreignKey: 'reviewer_id',
    onDelete: 'CASCADE',
});
Review.belongsTo(User, {
    as: 'Reviewer',
    foreignKey: 'reviewer_id',
});

// User and Review associations for reviews received by the user (as a renter or property manager).
// Later can be used to access all reviews received by a user using the alias 'ReceivedReviews' e.g. User.findAll({ include: 'ReceivedReviews' })

User.hasMany(Review, {
    as: 'ReceivedReviews',
    foreignKey: 'reviewee_id',
    constraints: false,
    scope: {
        reviewee_type: 'user',
    },
});
Review.belongsTo(User, {
    as: 'Reviewee',
    foreignKey: 'reviewee_id',
    constraints: false,
});

// Property and Review associations for reviews written about a property
Review.belongsTo(Property, {
    foreignKey: 'reviewee_id',
    constraints: false,
    scope: {
        reviewee_type: 'property',
    },
});

// This is how we will access all reviews for a property
Property.hasMany(Review, {
    foreignKey: 'reviewee_id',
    constraints: false,
    scope: {
        reviewee_type: 'property',
    },
});

// Lease-Property association: A property can have many leases
Property.hasMany(Lease, {
    foreignKey: 'property_id',
    as: 'leases', // alias for accessing property -> lease
    onDelete: 'CASCADE',
});

// Lease belongs to a Property
Lease.belongsTo(Property, {
    foreignKey: 'property_id',
    as: 'property', // alias for accessing lease -> property
});

// User-Lease association: A user (as a renter) can have many leases
User.hasMany(Lease, {
    foreignKey: 'renter_id',
    as: 'rentals', // alias for accessing User -> Lease
    onDelete: 'CASCADE',
});

// Lease belongs to a User (renter)
Lease.belongsTo(User, {
    foreignKey: 'renter_id',
    as: 'renter', // alias for accessing Lease -> User
});

module.exports = { User, Property, Review, Lease };
