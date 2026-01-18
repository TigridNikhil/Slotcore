const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const app = require("./app");
const sequelize = require("./config/database");
const { initCronJobs } = require("./jobs/cronJobs");

// Integration Routes
const integrationRoutes = require("./routes/integrationRoutes");
app.use("/api/integrations", integrationRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    // Sync models (use { force: true } only for dev/reset)
    await sequelize.sync({ alter: true });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      initCronJobs();
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
