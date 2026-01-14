const sequelize = require("../src/config/database");
const categorySeeder = require("../seeders/20250114000001-seed-categories");

async function seed() {
  try {
    console.log("Starting manual seed...");
    const queryInterface = sequelize.getQueryInterface();
    await categorySeeder.up(queryInterface, sequelize);
    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
