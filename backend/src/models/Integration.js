const { DataTypes } = require("sequelize");
const { sequelize } = require("./index"); // Will be circular if I import index here directly for sequelize instance if not careful, usually passed or defined in separate config.
// However, looking at other models (need to verify pattern), usually they export a function or use the sequelize instance from a config.
// Let's assume standard Sequelize definition.

module.exports = (sequelize) => {
  const Integration = sequelize.define("Integration", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orgId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM("google", "outlook"),
      allowNull: false,
    },
    credentials: {
      type: DataTypes.JSON, // Stores access_token, refresh_token, expiry_date, scope
      allowNull: true,
    },
    settings: {
      type: DataTypes.JSON, // Stores sync direction, selected calendars, etc.
      defaultValue: { syncDirection: "both" },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastSyncAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Integration;
};
