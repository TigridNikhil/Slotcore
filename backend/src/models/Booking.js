const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerMobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    staffId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Customers",
        key: "id",
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: true, // For legacy support or virtual/global bookings
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // 'pending', 'confirmed', 'cancelled', 'awaiting_completion', 'completed', 'no_show'
    },
    notes: {
      type: DataTypes.TEXT,
    },
    cancellationReason: {
      type: DataTypes.TEXT,
    },
    rescheduleReason: {
      type: DataTypes.TEXT,
    },
    bookingId: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for legacy, but new ones will have it
      unique: true,
    },
    reminder24hSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reminder1hSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("unpaid", "paid", "pay_at_venue", "refunded"),
      defaultValue: "unpaid",
    },
    paymentMethod: {
      type: DataTypes.STRING, // 'online', 'venue'
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded", "unpaid"),
      defaultValue: "unpaid",
    },
    paymentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    platformCommissionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    vendorReceivableAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    hooks: {
      beforeCreate: (booking) => {
        if (!booking.bookingId) {
          const { generateBookingId } = require("../utils/idGenerator");
          booking.bookingId = generateBookingId();
        }
      },
    },
  }
);

module.exports = Booking;
