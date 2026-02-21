const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { sequelize } = require("./models");

const tenantResolver = require("./middlewares/tenantResolver");
const responseMiddleware = require("./middlewares/responseMiddleware");

// Routes
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
const consumerRoutes = require("./routes/consumerRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------ MIDDLEWARES ------------------ */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://checkout.razorpay.com",
        ],
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://checkout.razorpay.com",
        ],
        frameSrc: [
          "'self'",
          "https://api.razorpay.com/",
          "https://maps.google.com/",
          "https://www.google.com/",
        ],
        connectSrc: ["'self'", "https://lumberjack.razorpay.com"],
        imgSrc: ["'self'", "data:", "https:"],
        upgradeInsecureRequests: null,
      },
    },
    hsts: false, // Disable HSTS to prevent forcing HTTPS on local IP
    frameguard: false, // Allow framing (for Expo Web testing)
  }),
);
app.use(
  cors({
    origin: true, // Allow all origins (reflects the request origin)
    credentials: true, // Allow cookies/auth headers
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use(responseMiddleware);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"));
});

/* ------------------ HEALTH ------------------ */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

/* ------------------ API ROUTES ------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/services", tenantResolver, serviceRoutes);
app.use("/api/bookings", tenantResolver, bookingRoutes);
app.use("/api/organization", tenantResolver, organizationRoutes);
app.use("/api/customers", tenantResolver, customerRoutes);
app.use("/api/ai", tenantResolver, aiRoutes);
app.use("/api/locations", tenantResolver, locationRoutes);
app.use("/api/payment", tenantResolver, paymentRoutes);
app.use("/api/notifications", tenantResolver, notificationRoutes);
app.use("/api/resources", tenantResolver, resourceRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/platform", platformRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/mobile/consumer", consumerRoutes);

/* ------------------ ERROR HANDLING ------------------ */
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
