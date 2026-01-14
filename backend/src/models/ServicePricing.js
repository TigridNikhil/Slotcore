const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServicePricing = sequelize.define(
  "ServicePricing",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Services", key: "id" },
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: true, // Null means default pricing for the service
      references: { model: "Locations", key: "id" },
    },
    paymentType: {
      type: DataTypes.ENUM("FREE", "FULL", "ADVANCE"),
      defaultValue: "FULL",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    advanceAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
    },
  },
  { timestamps: true }
);

module.exports = ServicePricing;
