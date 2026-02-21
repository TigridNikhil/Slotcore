const {
  Organization,
  Booking,
  User,
  sequelize,
  MarketplaceStat,
  VendorLedger,
  AuditLog,
} = require("../models");
const jwt = require("jsonwebtoken");

// POST /api/platform/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Simple Environment-based Super Admin
  const adminEmail = process.env.PLATFORM_ADMIN_EMAIL || "admin@slotcore.com";
  const adminPass = process.env.PLATFORM_ADMIN_PASS || "admin123";

  if (email === adminEmail && password === adminPass) {
    const token = jwt.sign(
      { role: "super_admin", email },
      process.env.JWT_SECRET || "secret_dev_key",
      { expiresIn: "1d" },
    );
    return res.successResponse(
      { token, user: { email, role: "super_admin" } },
      "Login successful",
    );
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
};

// GET /api/platform/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrgs = await Organization.count();
    const activeOrgs = await Organization.count({ where: { isActive: true } });
    const totalBookings = await Booking.count();

    // Calculate Total Revenue (Real: Sum of platform commissions)
    const revenue = await VendorLedger.sum("platformCommission");

    res.successResponse({
      totalOrgs,
      activeOrgs,
      totalBookings,
      revenue: revenue || 0,
    });
  } catch (error) {
    console.error("Platform Stats Error:", error);
    res.serverError(error.message, "Failed to fetch stats");
  }
};

// GET /api/platform/organizations/:id/stats
exports.getOrgStats = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.notFound("Organization not found");
    }

    const totalBookings = await Booking.count({ where: { orgId: id } });
    const activeServices = await sequelize.models.Service.count({
      where: { orgId: id, isActive: true },
    });

    // Revenue (using Service price on Booking if available, or just placeholder logic for now)
    // Assuming we can join Service to get price
    const revenueBookings = await Booking.findAll({
      where: {
        orgId: id,
        status: { [sequelize.Sequelize.Op.or]: ["confirmed", "completed"] },
      },
      include: [{ model: sequelize.models.Service, attributes: ["price"] }],
    });

    const revenue = revenueBookings.reduce((sum, booking) => {
      return sum + (Number(booking.Service?.price) || 0);
    }, 0);

    // Marketplace Stats Aggregation
    const marketplaceStats = await MarketplaceStat.findAll({
      where: { orgId: id },
      order: [["date", "DESC"]],
      limit: 30,
    });

    const mkTotalViews = marketplaceStats.reduce((sum, s) => sum + s.views, 0);
    const mkTotalClicks = marketplaceStats.reduce(
      (sum, s) => sum + s.clicks,
      0,
    );
    const mkTotalRedirects = marketplaceStats.reduce(
      (sum, s) => sum + s.redirects,
      0,
    );

    res.successResponse({
      organization,
      totalBookings,
      activeServices,
      revenue,
      marketplace: {
        totalViews: mkTotalViews,
        totalClicks: mkTotalClicks,
        totalRedirects: mkTotalRedirects,
        dailyStats: marketplaceStats,
      },
    });
  } catch (error) {
    console.error("Org Stats Error:", error);
    res.serverError(error.message, "Failed to fetch org stats");
  }
};

// GET /api/platform/organizations
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.successResponse(organizations);
  } catch (error) {
    console.error("Platform List Error:", error);
    res.serverError(error.message, "Failed to fetch organizations");
  }
};

// PUT /api/platform/organizations/:id/marketplace
exports.updateMarketplaceSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMarketplaceVisible, marketplaceRank, marketplaceTag, isActive } =
      req.body;

    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.notFound("Organization not found");
    }

    if (isMarketplaceVisible !== undefined)
      organization.isMarketplaceVisible = isMarketplaceVisible;
    if (marketplaceRank !== undefined)
      organization.marketplaceRank = marketplaceRank;
    if (marketplaceTag !== undefined)
      organization.marketplaceTag = marketplaceTag;
    if (isActive !== undefined) organization.isActive = isActive;

    await organization.save();

    res.successResponse(organization, "Marketplace settings updated");
  } catch (error) {
    console.error("Platform Update Error:", error);
    res.serverError(error.message, "Failed to update marketplace settings");
  }
};

// GET /api/platform/audit-logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, orgId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (orgId) {
      whereClause.orgId = orgId;
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Organization,
          attributes: ["name", "slug"],
        },
      ],
    });

    res.successResponse({
      logs: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Audit Logs Error:", error);
    res.serverError(error.message, "Failed to fetch audit logs");
  }
};
