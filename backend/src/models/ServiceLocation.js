const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceLocation = sequelize.define("ServiceLocation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  serviceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Services",
      key: "id",
    },
  },
  locationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Locations",
      key: "id",
    },
  },
});

module.exports = ServiceLocation;
