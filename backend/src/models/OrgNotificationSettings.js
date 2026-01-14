const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrgNotificationSettings = sequelize.define(
  "OrgNotificationSettings",
  {
    orgId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: "Organizations", key: "id" },
    },
    enableSMS: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    enableWhatsApp: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    whatsappTemplateId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = OrgNotificationSettings;
