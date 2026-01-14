const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bookingId: {
    type: DataTypes.UUID,
    allowNull: true, // Can be null initially if payment created before booking confirmation
    references: {
      model: "Bookings",
      key: "id",
    },
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  signature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "INR",
  },
  status: {
    type: DataTypes.ENUM(
      "created",
      "paid",
      "failed",
      "refund_pending",
      "refunded"
    ),
    defaultValue: "created",
  },
  method: {
    type: DataTypes.STRING, // e.g., 'card', 'upi', 'pay_at_venue'
  },
});

module.exports = Payment;
