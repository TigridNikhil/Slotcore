const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Schedule = sequelize.define("Schedule", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orgId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  locationId: {
    type: DataTypes.UUID,
    allowNull: true, // Null means "Default Organization Schedule"
  },
  dayOfWeek: {
    type: DataTypes.INTEGER, // 0=Sunday, 1=Monday, ... 6=Saturday
    allowNull: false,
    validate: { min: 0, max: 6 },
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: "09:00:00",
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: "17:00:00",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  breakStartTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  breakEndTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  isBreakActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Schedule;
