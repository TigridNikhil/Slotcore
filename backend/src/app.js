const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { sequelize } = require("./models");

const tenantResolver = require("./middlewares/tenantResolver");
const responseMiddleware = require("./middlewares/responseMiddleware");
const apiKeyAuth = require("./middlewares/apiKeyAuth");

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
const billingRoutes = require("./routes/billingRoutes");
const developerRoutes = require("./routes/developerRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------ MIDDLEWARES ------------------ */
const allowedOrigins = [
  // "https://slotcore.vercel.app",
  // "http://localhost:5173",
  // "http://localhost:5174",
  // "http://localhost:5000",
  // "http://127.0.0.1:5173",
  // "http://127.0.0.1:5174",
  // "http://127.0.0.1:5000",
  // "https://slotcore-production.up.railway.app",
  // "https://slotcorewidget.vercel.app",
  "*",
];

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
        connectSrc: [
          "'self'",
          "https://lumberjack.razorpay.com",
          "https://slotcore-production.up.railway.app",
        ],
        imgSrc: ["'self'", "data:", "https:"],
        upgradeInsecureRequests: null,
      },
    },
    hsts: false,
    frameguard: false,
  }),
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        console.warn(`[CORS] Rejected Origin: ${origin}`);
        return callback(
          new Error(
            "The CORS policy for this site does not allow access from the specified Origin.",
          ),
          false,
        );
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Tenant-Slug",
      "X-Organization-Id",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan("dev"));
app.use(responseMiddleware);
app.use(apiKeyAuth);

// Serve static files (for widgets and docs)
app.use(express.static(path.join(__dirname, "../public")));

// app.use(express.static(path.join(__dirname, "../../frontend/dist")));
// app.get(/^(?!\/api).*/, (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"));
// });

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
app.use("/api/billing", tenantResolver, billingRoutes);
app.use("/api/developers", tenantResolver, developerRoutes);

/* ------------------ PLATFORM V1 ROUTES ------------------ */
const v1Routes = require("./routes/v1Routes");
app.use("/api/v1", tenantResolver, v1Routes);
// Keep legacy /v1 for widget external access
app.use("/v1", tenantResolver, v1Routes);

/* ------------------ ERROR HANDLING ------------------ */
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
