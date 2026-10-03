const User = require('./User');
const Vehicle = require('./Vehicle');
const Location = require('./Location');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Maintenance = require('./Maintenance');
const Review = require('./Review');

Vehicle.belongsTo(Location, { as: 'location', foreignKey: 'locationId' });
Booking.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Booking.belongsTo(User, { as: 'verifier', foreignKey: 'verifiedBy' });
Booking.belongsTo(Vehicle, { as: 'vehicle', foreignKey: 'vehicleId' });
Booking.belongsTo(Location, { as: 'pickupLocation', foreignKey: 'pickupLocationId' });
Booking.belongsTo(Location, { as: 'dropoffLocation', foreignKey: 'dropoffLocationId' });
Payment.belongsTo(Booking, { as: 'booking', foreignKey: 'bookingId' });
Payment.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Maintenance.belongsTo(Vehicle, { as: 'vehicle', foreignKey: 'vehicleId' });
Review.belongsTo(User, { as: 'reviewer', foreignKey: 'user' });
Review.belongsTo(Vehicle, { as: 'vehicleDetails', foreignKey: 'vehicle' });

module.exports = { User, Vehicle, Location, Booking, Payment, Maintenance, Review };