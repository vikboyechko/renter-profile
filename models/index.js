const Users = require('./Users');
const Properties = require('./Properties');
const Reviews = require('./Reviews');
const Leases = require('./Leases');
const Documents = require('./Documents');

// User and Property associations
Users.hasMany(Properties, {
    as: 'UserRentals', // alias for user -> property
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});
Properties.belongsTo(Users, {
    foreignKey: 'user_id',
});

// User and Review associations for reviews written by the user
// Later can be used to access all reviews written by a user using the alias 'WrittenReviews' e.g. User.findAll({ include: 'WrittenReviews' })

Users.hasMany(Reviews, {
    as: 'WrittenReviews',
    foreignKey: 'reviewer_id',
    onDelete: 'CASCADE',
});
Reviews.belongsTo(Users, {
    as: 'Reviewer',
    foreignKey: 'reviewer_id',
});

// User and Review associations for reviews received by the user (as a renter or property manager).
// Later can be used to access all reviews received by a user using the alias 'ReceivedReviews' e.g. User.findAll({ include: 'ReceivedReviews' })

Users.hasMany(Reviews, {
    as: 'ReceivedReviews',
    foreignKey: 'reviewee_id',
    constraints: false,
    scope: {
        reviewee_type: 'user',
    },
});
Reviews.belongsTo(Users, {
    as: 'Reviewee',
    foreignKey: 'reviewee_id',
    constraints: false,
    scope: {
        reviewee_type: 'user',
    },
});

// Property and Review associations for reviews written about a property

// This is how we will access all reviews for a property
Properties.hasMany(Reviews, {
    foreignKey: 'property_id',
    constraints: false,
});

Reviews.belongsTo(Properties, {
    foreignKey: 'property_id',
    constraints: false,
});

// Lease-Property association: A property can have many leases
Properties.hasMany(Leases, {
    foreignKey: 'property_id',
    as: 'leases', // alias for accessing property -> lease
    onDelete: 'CASCADE',
});

// Lease belongs to a Property
Leases.belongsTo(Properties, {
    foreignKey: 'property_id',
    as: 'property', // alias for accessing lease -> property
});

// User-Lease association: A user (as a renter) can have many leases
Users.hasMany(Leases, {
    foreignKey: 'renter_id',
    as: 'rentals', // alias for accessing User -> Lease
    onDelete: 'CASCADE',
});

// Lease belongs to a User (renter)
Leases.belongsTo(Users, {
    foreignKey: 'renter_id',
    as: 'renter', // alias for accessing Lease -> User
});

// User and Document association
Users.hasMany(Documents, {
    foreignKey: 'user_id',
    as: 'UserDocuments', //
});

Documents.belongsTo(Users, {
    foreignKey: 'user_id',
    as: 'user',
});

// Property and Document association
Properties.hasMany(Documents, {
    foreignKey: 'property_id',
    as: 'PropertyDocuments',
});

Documents.belongsTo(Properties, {
    foreignKey: 'property_id',
    as: 'property',
});

module.exports = { Users, Properties, Reviews, Leases, Documents };
