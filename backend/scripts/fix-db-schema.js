const sequelize = require("../src/config/database");

async function fixDb() {
  try {
    const qi = sequelize.getQueryInterface();

    console.log("Adding isActive to Resources...");
    try {
      await qi.addColumn("Resources", "isActive", {
        type: require("sequelize").DataTypes.BOOLEAN,
        defaultValue: true,
      });
      console.log("Added isActive to Resources.");
    } catch (e) {
      console.log("isActive already exists or error on Resources:", e.message);
    }

    console.log("Adding isActive to organization_checklist_statuses...");
    try {
      await qi.addColumn("organization_checklist_statuses", "isActive", {
        type: require("sequelize").DataTypes.BOOLEAN,
        defaultValue: true,
      });
      console.log("Added isActive to organization_checklist_statuses.");
    } catch (e) {
      console.log(
        "isActive already exists or error on organization_checklist_statuses:",
        e.message,
      );
    }

    console.log("Checking Organizations table...");
    // Just a sample check if other columns might be missing based on common 500s
    // If onboardingCompleted is missing, add it.
    try {
      await qi.addColumn("Organizations", "onboardingCompleted", {
        type: require("sequelize").DataTypes.BOOLEAN,
        defaultValue: false,
      });
      console.log("Added onboardingCompleted to Organizations.");
    } catch (e) {
      console.log("onboardingCompleted check done.");
    }

    console.log("DB Fix Completed.");
    process.exit(0);
  } catch (error) {
    console.error("DB Fix Failed:", error);
    process.exit(1);
  }
}

fixDb();
