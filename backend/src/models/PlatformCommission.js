const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PlatformCommission = sequelize.define(
  "PlatformCommission",
  {
    orgId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: "Organizations", key: "id" },
    },
    commissionType: {
      type: DataTypes.ENUM("PERCENTAGE", "FIXED"),
      defaultValue: "PERCENTAGE",
    },
    commissionValue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 10.0, // Default 10%
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = PlatformCommission;
