const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserLocation = sequelize.define(
  "UserLocation",
  {
    userId: {
      type: DataTypes.UUID,
      references: { model: "Users", key: "id" },
      primaryKey: true,
    },
    locationId: {
      type: DataTypes.UUID,
      references: { model: "Locations", key: "id" },
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    tableName: "UserLocations",
  }
);

module.exports = UserLocation;
