const { Plan } = require("../models");
const { PLANS } = require("../config/plans");

const seedPlans = async () => {
  try {
    console.log("🌱 Seeding Plans...");

    // Force sync the Plan table to ensure schema matches and clear legacy data
    await Plan.sync({ force: true });

    for (const key of Object.keys(PLANS)) {
      const planConfig = PLANS[key];

      await Plan.upsert({
        key: planConfig.key,
        name: planConfig.name,
        priceMonthly: planConfig.price.monthly || 0,
        priceYearly: planConfig.price.yearly || 0,
        limits: planConfig.limits,
        features: planConfig.features,
        isActive: true, // Default to active
      });
      console.log(`✅ Plan seeded: ${planConfig.name}`);
    }

    console.log("✨ Plans seeding completed.");
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
  }
};

module.exports = seedPlans;
