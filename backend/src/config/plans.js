module.exports = {
  PLANS: {
    STARTER: {
      key: "STARTER",
      name: "Starter",
      price: { monthly: 0, yearly: 0 },
      limits: {
        maxUsers: 1,
        maxAppointments: 100, // per month
        maxLocations: 1,
        maxServices: 5,
      },
      features: [
        "basic_calendar",
        "email_notifications",
        "mobile_app_access",
        "sms_reminders",
      ],
    },
    GROWTH: {
      key: "GROWTH",
      name: "Growth",
      price: { monthly: 24, yearly: 288 }, // 24 * 12 = 288
      limits: {
        maxUsers: 5,
        maxAppointments: -1, // Unlimited
        maxLocations: 3,
        maxServices: 20,
      },
      features: [
        "google_outlook_sync",
        "sms_reminders",
        "client_portal",
        "basic_reporting",
        "white_labeling",
        "api_access",
        "dedicated_support",
      ],
    },
    BUSINESS: {
      key: "BUSINESS",
      name: "Business",
      price: { monthly: 65, yearly: 780 },
      limits: {
        maxUsers: 20,
        maxAppointments: -1,
        maxLocations: 10,
        maxServices: -1,
      },
      features: [
        "advanced_analytics",
        "payment_processing_zero_fees",
        "white_label_booking_page",
        "priority_email_support",
        "custom_integrations",
        "sla_guarantees",
      ],
    },
    ENTERPRISE: {
      key: "ENTERPRISE",
      name: "Enterprise",
      price: { monthly: null, yearly: null }, // Custom
      limits: {
        maxUsers: -1,
        maxAppointments: -1,
        maxLocations: -1,
        maxServices: -1,
      },
      features: [
        "unlimited_users",
        "dedicated_account_manager",
        "sso_custom_security",
        "api_webhooks",
        "uptime_sla_99_9",
      ],
    },
  },
};
