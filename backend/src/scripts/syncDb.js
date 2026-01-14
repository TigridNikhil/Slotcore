const { sequelize } = require("../models");

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Database.");

    // Force sync to drop and recreate tables (Beware in production!)
    // For Development MVP, this is fine.
    await sequelize.sync({ force: true });
    console.log("✅ Database Synced (Tables Recreated).");

    // ========================
    // Seed Data
    // ========================

    // 1. Seed Plans
    const seedPlans = require("../seeders/planSeeder");
    await seedPlans();

    // 2. Create Demo Organization
    const { Organization, User, Plan } = require("../models");
    const bcrypt = require("bcryptjs");

    // Find a plan to attach (Starter)
    const starterPlan = await Plan.findOne({ where: { key: "STARTER" } });

    const demoOrg = await Organization.create({
      name: "Demo Clinic",
      slug: "demo",
      plan: "STARTER",
      // planId: starterPlan?.id, // If association exists
      primaryColor: "#0ea5e9", // Sky 500
    });
    console.log("🌱 Seeded Organization: demo.slotcore.com");

    // 3. Create Admin User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    await User.create({
      orgId: demoOrg.id,
      name: "Dr. Demo",
      email: "admin@demo.com",
      passwordHash: passwordHash,
      role: "admin",
    });
    console.log("🌱 Seeded User: admin@demo.com");

    process.exit(0);
  } catch (error) {
    console.error("❌ Sync Failed:", error);
    process.exit(1);
  }
}
syncDatabase();
