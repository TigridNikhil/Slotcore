const sequelize = require("../src/config/database");

async function fix() {
  try {
    console.log("Checking columns in Resources...");
    const [cols] = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'Resources'",
    );
    const names = cols.map((c) => c.column_name);
    console.log("Current columns:", names);

    if (!names.includes("isActive")) {
      console.log("Adding isActive column...");
      await sequelize.query(
        'ALTER TABLE "Resources" ADD COLUMN "isActive" BOOLEAN DEFAULT true',
      );
      console.log("Column added.");
    } else {
      console.log("isActive already exists.");
    }

    // Verify again
    const [finalCols] = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'Resources'",
    );
    console.log(
      "Final columns:",
      finalCols.map((c) => c.column_name),
    );

    console.log("FIX_DB_FINISHED_SUCCESSFULLY");
    process.exit(0);
  } catch (e) {
    console.error("FIX_DB_FAILED:", e.message);
    process.exit(1);
  }
}

fix();
