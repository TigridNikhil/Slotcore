const sequelize = require("../src/config/database");

async function fixDb() {
  try {
    console.log("Adding isActive column to Resources table via direct SQL...");
    await sequelize.query(
      'ALTER TABLE "Resources" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true',
    );
    console.log("Success.");
    process.exit(0);
  } catch (error) {
    console.error("Failed:", error.message);
    process.exit(1);
  }
}

fixDb();
