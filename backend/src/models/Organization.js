const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Organization = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/i, // Slugs should be URL-safe
        notIn: [["www", "api", "admin", "app"]], // Reserved subdomains
      },
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    primaryColor: {
      type: DataTypes.STRING,
      defaultValue: "#4F46E5", // Default Indigo-600
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.JSONB,
      defaultValue: {
        heroTagline: "Welcome to our booking page",
        heroSubheadline: "Book your appointment with ease and convenience.",
        aboutUs:
          "We are a dedicated team providing excellent services to our valued customers. Our mission is to ensure quality and satisfaction in every interaction.",
      },
    },
    // Policies
    cancellationWindowHr: {
      type: DataTypes.INTEGER,
      defaultValue: 24, // Hours
    },
    refundPolicy: {
      type: DataTypes.TEXT,
      defaultValue: "Refunds are processed manually within 2-3 business days.",
    },
    // Subscription & Plans
    plan: {
      type: DataTypes.ENUM("STARTER", "GROWTH", "BUSINESS", "ENTERPRISE"),
      defaultValue: "STARTER",
    },
    billingCycle: {
      type: DataTypes.ENUM("MONTHLY", "YEARLY"),
      defaultValue: "MONTHLY",
    },
    subscriptionStatus: {
      type: DataTypes.ENUM("ACTIVE", "PAST_DUE", "CANCELED", "TRIAL"),
      defaultValue: "ACTIVE",
    },
    // Overrides
    featureFlags: {
      type: DataTypes.JSONB,
      defaultValue: {}, // Store enabled features explicitly e.g. { "sms_reminders": true }
    },
    limits: {
      type: DataTypes.JSONB,
      defaultValue: {}, // Custom limit overrides e.g. { "maxUsers": 10 }
    },
    // Marketplace Visibility
    isMarketplaceVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    marketplaceRank: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    marketplaceTag: {
      type: DataTypes.ENUM("NONE", "FEATURED", "NEW", "POPULAR"),
      defaultValue: "NONE",
    },
    // Categorization
    category: {
      type: DataTypes.ENUM(
        "Diagnostics & Labs",
        "Clinics & Hospitals",
        "Salons & Wellness",
        "Professional Services",
        "Education & Training",
        "Government Services",
        "Home & Field Services",
        "Corporate & Enterprise",
        "Other",
      ),
      defaultValue: "Other",
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    subCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Ratings
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    onboardingCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    trialEndsAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    indexes: [{ unique: true, fields: ["slug"] }],
  },
);

module.exports = Organization;
