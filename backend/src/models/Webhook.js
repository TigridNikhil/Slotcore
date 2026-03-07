const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Webhook = sequelize.define(
  "Webhook",
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () =>
        `whsec_${require("crypto").randomBytes(16).toString("hex")}`,
    },
    events: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: ["*"], // Wildcard for all events
    },
    description: {
      type: DataTypes.STRING,
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
        fields: ["orgId"],
      },
    ],
  },
);

module.exports = Webhook;
