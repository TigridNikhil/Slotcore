const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Plan = sequelize.define(
  "Plan",
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priceMonthly: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    priceYearly: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    limits: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    features: {
      type: DataTypes.JSONB, // Array of feature strings
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Plan;
