const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PageSection = sequelize.define("PageSection", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  pageName: {
    type: DataTypes.STRING,
    defaultValue: "home",
  },
  sectionType: {
    type: DataTypes.STRING,
    allowNull: false, // 'hero', 'about', 'testimonials', 'footer'
  },
  content: {
    type: DataTypes.JSONB,
    defaultValue: {},
    allowNull: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = PageSection;
