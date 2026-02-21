/**
 * Central configuration for Pricing Plans
 * Maps plan names (STARTER, GROWTH, BUSINESS, ENTERPRISE) to their limits and features.
 */

const PLAN_CONFIG = {
  STARTER: {
    maxUsers: 1, // 1 User Account total
    maxLocations: 1,
    maxAppointmentsPerMonth: 200,
    priceMonthly: 499,
    priceYearly: 4999,
    features: {
      whatsappReminders: false,
      onlinePayments: false,
      teamManagement: false,
      customBranding: false,
      whiteLabel: false,
      advancedAnalytics: false,
      apiAccess: false,
    },
    platformFee: 0,
  },
  GROWTH: {
    maxUsers: 5, // Up to 5 Users
    maxLocations: 3,
    maxAppointmentsPerMonth: Infinity,
    priceMonthly: 999,
    priceYearly: 9999,
    features: {
      whatsappReminders: true,
      onlinePayments: true,
      teamManagement: true,
      customBranding: true,
      whiteLabel: false,
      advancedAnalytics: false,
      apiAccess: false,
    },
    platformFee: 0.03, // 3%
  },
  BUSINESS: {
    maxUsers: 20, // Up to 20 Users
    maxLocations: Infinity,
    maxAppointmentsPerMonth: Infinity,
    priceMonthly: 1999,
    priceYearly: 19999,
    features: {
      whatsappReminders: true,
      onlinePayments: true,
      teamManagement: true,
      customBranding: true,
      whiteLabel: true,
      advancedAnalytics: true,
      apiAccess: false,
    },
    platformFee: 0.02, // 2%
  },
  ENTERPRISE: {
    maxUsers: Infinity,
    maxLocations: Infinity,
    maxAppointmentsPerMonth: Infinity,
    priceMonthly: null, // Custom
    priceYearly: null, // Custom
    features: {
      whatsappReminders: true,
      onlinePayments: true,
      teamManagement: true,
      customBranding: true,
      whiteLabel: true,
      advancedAnalytics: true,
      apiAccess: true,
    },
    platformFee: 0.01,
  },
};

module.exports = PLAN_CONFIG;
