const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Resource = sequelize.define("Resource", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orgId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // e.g., 'room', 'equipment'
    defaultValue: "asset",
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1, // Total available inventory of this resource
  },
});

module.exports = Resource;
