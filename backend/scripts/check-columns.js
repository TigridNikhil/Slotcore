const sequelize = require("../src/config/database");

async function checkCols() {
  try {
    const [results] = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'Resources'",
    );
    console.log(
      "Columns in Resources:",
      results.map((r) => r.column_name),
    );
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkCols();
