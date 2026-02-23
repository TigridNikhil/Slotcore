const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BillingTransaction = sequelize.define("BillingTransaction", {
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
  plan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billingCycle: {
    type: DataTypes.ENUM("MONTHLY", "YEARLY"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "INR",
  },
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpaySignature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("created", "paid", "failed"),
    defaultValue: "created",
  },
  periodStart: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  periodEnd: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = BillingTransaction;
