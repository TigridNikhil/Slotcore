const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WebhookEvent = sequelize.define(
  "WebhookEvent",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    webhookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Webhooks",
        key: "id",
      },
    },
    event: {
      type: DataTypes.STRING, // e.g., 'booking.created'
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    responseStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    responseBody: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed", "retrying"),
      defaultValue: "pending",
    },
    retryCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    nextRetryAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        fields: ["webhookId"],
      },
      {
        fields: ["status"],
      },
    ],
  },
);

module.exports = WebhookEvent;
