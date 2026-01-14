const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Imports
const { sequelize } = require("./models"); // Import sequelize instance
const tenantResolver = require("./middlewares/tenantResolver");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const customerRoutes = require("./routes/customerRoutes");
const aiRoutes = require("./routes/aiRoutes");
const locationRoutes = require("./routes/locationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const platformRoutes = require("./routes/platformRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Auth Routes (Global)
app.use("/api/auth", authRoutes);

// Protected Routes (Require Tenant)
app.use("/api/services", tenantResolver, serviceRoutes);
app.use("/api/bookings", tenantResolver, bookingRoutes);
app.use("/api/organization", tenantResolver, organizationRoutes);
app.use("/api/customers", tenantResolver, customerRoutes);
app.use("/api/customers", tenantResolver, customerRoutes);
app.use("/api/ai", tenantResolver, aiRoutes);
app.use("/api/locations", tenantResolver, locationRoutes);
app.use("/api/payment", tenantResolver, paymentRoutes);
app.use("/api/notifications", tenantResolver, notificationRoutes);
app.use("/api/resources", tenantResolver, resourceRoutes);

// Public Marketplace (No Tenant Resolver needed, or it handles it gracefully)
app.use("/api/marketplace", marketplaceRoutes);

// Platform Admin Routes (No Tenant Resolver needed)
app.use("/api/platform", platformRoutes);
app.use("/api/categories", categoryRoutes);

// Debug Route
app.get("/debug-tenant", tenantResolver, (req, res) => {
  if (req.isMainDomain) {
    return res.json({ message: "Welcome to Main Domain", context: "Global" });
  }
  res.json({
    message: `Welcome to ${req.tenant.name}`,
    tenant: req.tenant.slug,
    orgId: req.orgId,
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Database connection & Startup
(async () => {
  try {
    const PORT = process.env.PORT || 5000;
    // Authenticate Database
    await sequelize.authenticate();
    console.log("Database connected (External)");
    // Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
})();
module.exports = app;
