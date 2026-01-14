const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceResource = sequelize.define("ServiceResource", {
  serviceId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  resourceId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  quantityRequired: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

module.exports = ServiceResource;
