const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AuditLog = sequelize.define("AuditLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orgId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  entityId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING, // CREATE, UPDATE, DELETE, CANCEL, RESCHEDULE
    allowNull: false,
  },
  performedBy: {
    type: DataTypes.UUID, // User ID if logged in
    allowNull: true,
  },
  performedByEmail: {
    type: DataTypes.STRING, // If public user
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  changes: {
    type: DataTypes.JSONB, // { old: {}, new: {} }
    allowNull: true,
  },
});

module.exports = AuditLog;
