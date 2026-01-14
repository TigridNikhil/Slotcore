const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AvailabilityOverride = sequelize.define("AvailabilityOverride", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orgId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE, // Storing as date-only ideally, but DATE is fine if handled as UTC midnight
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  isOff: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // If true, whole day is off
  },
  serviceId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: "If set, override applies only to this service",
  },
});

module.exports = AvailabilityOverride;
