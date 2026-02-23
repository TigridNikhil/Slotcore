const sequelize = require("../config/database");
const Category = require("./Category"); // Moved to top
const Plan = require("./Plan");
const Organization = require("./Organization");
const User = require("./User");
const Service = require("./Service");
const Booking = require("./Booking");
const Payment = require("./Payment");
const PageSection = require("./PageSection");
const Consumer = require("./Consumer");

// ========================
// Associations
// ========================

// 1. Plan <-> Organization
Plan.hasMany(Organization, { foreignKey: "planId" });
Organization.belongsTo(Plan, { foreignKey: "planId" });

// 2. Organization <-> User
Organization.hasMany(User, { foreignKey: "orgId", onDelete: "CASCADE" });
User.belongsTo(Organization, { foreignKey: "orgId" });

// 3. Organization <-> Service
Organization.hasMany(Service, { foreignKey: "orgId", onDelete: "CASCADE" });
Service.belongsTo(Organization, { foreignKey: "orgId" });

// 4. Organization <-> Booking
Organization.hasMany(Booking, { foreignKey: "orgId", onDelete: "CASCADE" });
Booking.belongsTo(Organization, { foreignKey: "orgId" });

// 5. Organization <-> PageSection
Organization.hasMany(PageSection, { foreignKey: "orgId", onDelete: "CASCADE" });
PageSection.belongsTo(Organization, { foreignKey: "orgId" });

// 6. Service <-> Booking
Service.hasMany(Booking, { foreignKey: "serviceId" });
Booking.belongsTo(Service, { foreignKey: "serviceId" });

// 7. Organization <-> Integration
// Need to import Integration first, doing it at top of file
const Integration = require("./Integration")(sequelize);
const AvailabilityOverride = require("./AvailabilityOverride");
const StaffSchedule = require("./StaffSchedule");
const Customer = require("./Customer");
const AuditLog = require("./AuditLog");
const Location = require("./Location");
const Schedule = require("./Schedule");
const ServiceLocation = require("./ServiceLocation");
const UserLocation = require("./UserLocation");

Organization.hasMany(Integration, { foreignKey: "orgId", onDelete: "CASCADE" });
Integration.belongsTo(Organization, { foreignKey: "orgId" });

// 8. Organization <-> Schedule
Organization.hasMany(Schedule, { foreignKey: "orgId", onDelete: "CASCADE" });
Schedule.belongsTo(Organization, { foreignKey: "orgId" });

// 9. Organization <-> AvailabilityOverride
Organization.hasMany(AvailabilityOverride, {
  foreignKey: "orgId",
  onDelete: "CASCADE",
});
AvailabilityOverride.belongsTo(Organization, { foreignKey: "orgId" });

// 10. User <-> StaffSchedule
User.hasMany(StaffSchedule, { foreignKey: "userId", onDelete: "CASCADE" });
StaffSchedule.belongsTo(User, { foreignKey: "userId" });

// 11. Service <-> Staff (Many-to-Many)
Service.belongsToMany(User, {
  through: "ServiceStaff",
  as: "staff",
  foreignKey: "serviceId",
  otherKey: "userId",
});
User.belongsToMany(Service, {
  through: "ServiceStaff",
  as: "services",
  foreignKey: "userId",
  otherKey: "serviceId",
});

// 12. Booking <-> Staff
User.hasMany(Booking, { foreignKey: "staffId", as: "staffBookings" });
Booking.belongsTo(User, { foreignKey: "staffId", as: "staff" });

// 13. Customer Associations
Organization.hasMany(Customer, { foreignKey: "orgId", onDelete: "CASCADE" });
Customer.belongsTo(Organization, { foreignKey: "orgId" });

Customer.hasMany(Booking, { foreignKey: "customerId", as: "bookings" });
Booking.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

// 14. Location Associations
Organization.hasMany(Location, { foreignKey: "orgId", onDelete: "CASCADE" });
Location.belongsTo(Organization, { foreignKey: "orgId" });

// Service <-> Location (Many-to-Many)
// A service can be offered at multiple locations
Service.belongsToMany(Location, {
  through: "ServiceLocation",
  as: "locations",
  foreignKey: "serviceId",
  otherKey: "locationId",
});
Location.belongsToMany(Service, {
  through: "ServiceLocation",
  as: "services",
  foreignKey: "locationId",
  otherKey: "serviceId",
});

// User (Staff) <-> Location (Many-to-Many)
// Staff can work at multiple locations
User.belongsToMany(Location, {
  through: "UserLocation",
  as: "locations",
  foreignKey: "userId",
  otherKey: "locationId",
});
Location.belongsToMany(User, {
  through: "UserLocation",
  as: "staff",
  foreignKey: "locationId",
  otherKey: "userId",
});

// Booking <-> Location
Location.hasMany(Booking, { foreignKey: "locationId" });
Booking.belongsTo(Location, { foreignKey: "locationId" });

// Schedule <-> Location
// Schedules can be specific to a location (overriding Org default)
Location.hasMany(Schedule, { foreignKey: "locationId", onDelete: "CASCADE" });
Schedule.belongsTo(Location, { foreignKey: "locationId" });

// 15. Booking <-> Payment
Booking.hasOne(Payment, { foreignKey: "bookingId", onDelete: "CASCADE" });
Payment.belongsTo(Booking, { foreignKey: "bookingId" });

const Resource = require("./Resource");
const ServiceResource = require("./ServiceResource");
const MarketplaceStat = require("./MarketplaceStat");
const Review = require("./Review");
const ServicePricing = require("./ServicePricing");
const VendorLedger = require("./VendorLedger");
const PlatformCommission = require("./PlatformCommission");
const OrgNotificationSettings = require("./OrgNotificationSettings");
const BillingTransaction = require("./BillingTransaction");

// Associations
User.hasOne(Organization, { foreignKey: "ownerId", as: "organization" });
Organization.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// 16. Organization <-> Resource
Organization.hasMany(Resource, { foreignKey: "orgId", onDelete: "CASCADE" });
Resource.belongsTo(Organization, { foreignKey: "orgId" });

// 17. Service <-> Resource (Many-to-Many)
Service.belongsToMany(Resource, {
  through: ServiceResource,
  as: "resources",
  foreignKey: "serviceId",
  otherKey: "resourceId",
});
Resource.belongsToMany(Service, {
  through: ServiceResource,
  as: "services",
  foreignKey: "resourceId",
  otherKey: "serviceId",
});

// 18. Organization <-> Review
Organization.hasMany(Review, { foreignKey: "orgId", onDelete: "CASCADE" });
Review.belongsTo(Organization, { foreignKey: "orgId" });

// Booking <-> Review
Booking.hasOne(Review, { foreignKey: "bookingId" });
Review.belongsTo(Booking, { foreignKey: "bookingId" });

// 19. Service Pricing
Service.hasMany(ServicePricing, {
  foreignKey: "serviceId",
  onDelete: "CASCADE",
});
ServicePricing.belongsTo(Service, { foreignKey: "serviceId" });
Location.hasMany(ServicePricing, {
  foreignKey: "locationId",
  onDelete: "CASCADE",
});
ServicePricing.belongsTo(Location, { foreignKey: "locationId" });

// 20. Platform Commission
Organization.hasOne(PlatformCommission, {
  foreignKey: "orgId",
  onDelete: "CASCADE",
});
PlatformCommission.belongsTo(Organization, { foreignKey: "orgId" });

// 21. Vendor Ledger
Organization.hasMany(VendorLedger, {
  foreignKey: "orgId",
  onDelete: "CASCADE",
});
VendorLedger.belongsTo(Organization, { foreignKey: "orgId" });
Booking.hasOne(VendorLedger, { foreignKey: "bookingId" });
VendorLedger.belongsTo(Booking, { foreignKey: "bookingId" });

// 22. Notification Settings
Organization.hasOne(OrgNotificationSettings, {
  foreignKey: "orgId",
  onDelete: "CASCADE",
});
OrgNotificationSettings.belongsTo(Organization, { foreignKey: "orgId" });

// 23. Category <-> Organization
Category.hasMany(Organization, { foreignKey: "categoryId" });
Organization.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "categoryDetails",
});

// 24. AuditLog <-> Organization
Organization.hasMany(AuditLog, { foreignKey: "orgId" });

// 25. Organization <-> BillingTransaction
Organization.hasMany(BillingTransaction, {
  foreignKey: "orgId",
  onDelete: "CASCADE",
});
BillingTransaction.belongsTo(Organization, { foreignKey: "orgId" });
AuditLog.belongsTo(Organization, { foreignKey: "orgId" });

module.exports = {
  sequelize,
  Plan,
  Organization,
  User,
  Service,
  Booking,
  Payment,
  PageSection,
  Integration,
  Schedule,
  AvailabilityOverride,
  StaffSchedule,
  Customer,
  AuditLog,
  Location,
  Resource,
  ServiceResource,
  MarketplaceStat,
  Review,
  ServicePricing,
  VendorLedger,
  PlatformCommission,
  OrgNotificationSettings,
  OrgNotificationSettings,
  Category,
  Consumer,
  BillingTransaction,
};
