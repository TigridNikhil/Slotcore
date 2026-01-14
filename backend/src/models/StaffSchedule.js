const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StaffSchedule = sequelize.define(
  "StaffSchedule",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    dayOfWeek: {
      type: DataTypes.INTEGER, // 0-6 (Sun-Sat)
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      defaultValue: "09:00",
    },
    endTime: {
      type: DataTypes.TIME,
      defaultValue: "17:00",
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
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "dayOfWeek"],
      },
    ],
  }
);

module.exports = StaffSchedule;
