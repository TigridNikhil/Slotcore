const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceStaff = sequelize.define(
  "ServiceStaff",
  {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["serviceId", "userId"],
      },
    ],
  }
);

module.exports = ServiceStaff;
