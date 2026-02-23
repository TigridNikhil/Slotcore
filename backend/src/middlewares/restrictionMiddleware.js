const PLAN_CONFIG = require("../config/planConfig");
const { User, Location, Booking, Organization } = require("../models");
const { Op } = require("sequelize");

/**
 * Helper: Resolve the effective plan config for an organization.
 * If the org is on an active trial, they get BUSINESS-level access.
 * If the trial has expired, auto-downgrade subscriptionStatus to ACTIVE.
 */
async function getEffectivePlanConfig(org) {
  if (org.subscriptionStatus === "TRIAL") {
    if (org.trialEndsAt && new Date(org.trialEndsAt) > new Date()) {
      console.log("true");

      // Active trial → BUSINESS-level access
      return PLAN_CONFIG["BUSINESS"];
    } else {
      // Trial expired → downgrade silently
      org.subscriptionStatus = "ACTIVE";
      await org.save();
    }
  }

  // Check if subscription payment is overdue
  if (
    org.subscriptionStatus === "ACTIVE" &&
    org.nextDueDate &&
    new Date(org.nextDueDate) < new Date()
  ) {
    org.subscriptionStatus = "PAST_DUE";
    await org.save();
  }

  const planKey = org.plan || "STARTER";
  return PLAN_CONFIG[planKey];
}

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

      const config = await getEffectivePlanConfig(org);

      if (!config) {
        return res.serverError("Plan configuration missing");
      }

      if (resourceType === "users") {
        const userCount = await User.count({ where: { orgId } });
        if (userCount >= config.maxUsers) {
          return res.forbidden(
            `User limit reached for your plan (${config.maxUsers}). Please upgrade your plan.`,
          );
        }
      }

      if (resourceType === "locations") {
        const locationCount = await Location.count({ where: { orgId } });
        if (locationCount >= config.maxLocations) {
          return res.forbidden(
            `Location limit reached for your plan (${config.maxLocations}). Please upgrade your plan.`,
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
            `Monthly appointment limit reached for your plan (${config.maxAppointmentsPerMonth}). Please upgrade your plan.`,
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

      if (!org) {
        return res.notFound("Organization not found");
      }

      const config = await getEffectivePlanConfig(org);

      if (!config || !config.features[featureKey]) {
        return res.forbidden(
          `Feature '${featureKey}' is not available on your current plan. Please upgrade.`,
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
