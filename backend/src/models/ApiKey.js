const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ApiKey = sequelize.define(
  "ApiKey",
  {
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
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("secret", "public"),
      allowNull: false,
    },
    environment: {
      type: DataTypes.ENUM("live", "test"),
      allowNull: false,
      defaultValue: "test",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["key"],
      },
      {
        fields: ["orgId"],
      },
    ],
  },
);

module.exports = ApiKey;
