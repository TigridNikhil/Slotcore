const PLAN_CONFIG = require("../config/planConfig");
const { User, Location, Booking, Organization } = require("../models");
const { Op } = require("sequelize");

/**
 * Middleware to check if an organization has reached its plan limits
 * @param {string} resourceType - 'users', 'locations', 'appointments'
 */
const checkPlanLimit = (resourceType) => {
  return async (req, res, next) => {
    try {
      const orgId = req.orgId;
      if (!orgId) {
        return res.badRequest("Organization context missing");
      }

      const org = await Organization.findByPk(orgId);
      if (!org) {
        return res.notFound("Organization not found");
      }

      const planKey = org.plan || "STARTER";
      const config = PLAN_CONFIG[planKey];

      if (!config) {
        return res.serverError("Plan configuration missing");
      }

      if (resourceType === "users") {
        const userCount = await User.count({ where: { orgId } });
        if (userCount >= config.maxUsers) {
          return res.forbidden(
            `User limit reached for ${planKey} plan (${config.maxUsers}). Please upgrade your plan.`,
          );
        }
      }

      if (resourceType === "locations") {
        const locationCount = await Location.count({ where: { orgId } });
        if (locationCount >= config.maxLocations) {
          return res.forbidden(
            `Location limit reached for ${planKey} plan (${config.maxLocations}). Please upgrade your plan.`,
          );
        }
      }

      if (resourceType === "appointments") {
        // Check monthly limit
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const appointmentCount = await Booking.count({
          where: {
            orgId,
            createdAt: {
              [Op.gte]: startOfMonth,
            },
          },
        });

        if (appointmentCount >= config.maxAppointmentsPerMonth) {
          return res.forbidden(
            `Monthly appointment limit reached for ${planKey} plan (${config.maxAppointmentsPerMonth}). Please upgrade your plan.`,
          );
        }
      }

      next();
    } catch (error) {
      console.error("Plan Limit Check Error:", error);
      res.serverError("Error checking plan limits");
    }
  };
};

/**
 * Middleware to check if a specific feature is enabled for the organization's plan
 * @param {string} featureKey - e.g., 'onlinePayments', 'whatsappReminders'
 */
const checkFeatureEnabled = (featureKey) => {
  return async (req, res, next) => {
    try {
      const orgId = req.orgId;
      const org = await Organization.findByPk(orgId);
      const planKey = org?.plan || "STARTER";
      const config = PLAN_CONFIG[planKey];

      if (!config || !config.features[featureKey]) {
        return res.forbidden(
          `Feature '${featureKey}' is not available on your ${planKey} plan. Please upgrade.`,
        );
      }

      next();
    } catch (error) {
      console.error("Feature Check Error:", error);
      res.serverError("Error checking feature availability");
    }
  };
};

module.exports = {
  checkPlanLimit,
  checkFeatureEnabled,
};
