const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Customer = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orgId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Organizations",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true, // Some might only have phone? For now, allow null but usually required.
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB, // Array of strings e.g. ["VIP", "Late"]
      defaultValue: [],
    },
    totalBookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastBookingDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        fields: ["orgId", "email"], // Unique customer per org? Or allow dupes? Best to try unique.
        unique: false, // For now, maybe not unique if same email used for family members? Let's keep false.
      },
      {
        fields: ["orgId", "name"],
      },
    ],
  }
);

module.exports = Customer;
