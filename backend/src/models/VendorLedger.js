const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VendorLedger = sequelize.define(
  "VendorLedger",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orgId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Organizations", key: "id" },
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Bookings", key: "id" },
    },
    grossAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    platformCommission: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    netAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMode: {
      type: DataTypes.ENUM("ONLINE", "PAY_AT_VENUE"),
      allowNull: false,
      defaultValue: "ONLINE",
    },
    settlementDirection: {
      type: DataTypes.ENUM("PLATFORM_PAYS_VENDOR", "VENDOR_PAYS_PLATFORM"),
      allowNull: false,
      defaultValue: "PLATFORM_PAYS_VENDOR",
    },
    status: {
      type: DataTypes.ENUM("UNSETTLED", "SETTLED"), // Replaces UNPAID/PAID
      defaultValue: "UNSETTLED",
    },
    settledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = VendorLedger;
