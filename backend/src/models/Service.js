const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Service = sequelize.define("Service", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  durationMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  bufferTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: "Buffer time in minutes after the service",
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: "Max number of people per slot",
  },
  maxBookingsPerDay: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Limit total bookings per day for this service",
  },
  availabilityRules: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "Specific availability rules overrides",
  },
});



module.exports = Service;
