const { Organization, Booking, Service, sequelize } = require("../models");
const { Op } = require("sequelize");

exports.getPublicInfo = async (req, res) => {
  try {
    // req.tenant is set by tenantResolver
    const tenant = req.tenant;

    if (!tenant) {
      return res.notFound("Organization not found");
    }

    // Return only safe public info
    // Fetch active services for this org
    const services = await Service.findAll({
      where: { orgId: tenant.id, isActive: true },
      attributes: [
        "id",
        "name",
        "description",
        "price",
        ["durationMin", "duration"],
        "bufferTime",
        "capacity",
        "maxBookingsPerDay",
      ],
      include: [
        {
          association: "staff",
          attributes: ["id", "name", "title"], // Public info only
          through: { attributes: [] },
        },
      ],
    });

    const { Schedule, AvailabilityOverride } = require("../models");

    // Fetch Availability Rules
    const schedules = await Schedule.findAll({
      where: { orgId: tenant.id },
    });

    const overrides = await AvailabilityOverride.findAll({
      where: {
        orgId: tenant.id,
        date: {
          [Op.gte]: new Date(), // Only future overrides
        },
      },
    });

    res.successResponse({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      settings: tenant.settings,
      content: tenant.content,
      primaryColor: tenant.primaryColor,
      logoUrl: tenant.logoUrl,
      contactEmail: tenant.contactEmail,
      contactPhone: tenant.contactPhone,
      address: tenant.address,
      services, // Array of available services
      schedules,
      overrides,
    });
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Server error");
  }
};

exports.getStats = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { startDate, endDate } = req.query;

    // Default Date Range: Last 30 Days if not provided
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    if (!startDate) {
      start.setDate(start.getDate() - 30);
    }
    // Ensure end date includes the full day
    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    const dateFilter = {
      orgId,
      startTime: {
        [Op.between]: [start, end],
      },
    };

    // 1. Total Bookings in Range
    const totalBookings = await Booking.count({
      where: dateFilter,
    });

    // 2. Active Services (Snapshot, not time-bound usually, but we keep it simple)
    const activeServices = await Service.count({
      where: { orgId, isActive: true },
    });

    // 3. Revenue in Range (Confirmed/Completed)
    const revenueBookings = await Booking.findAll({
      where: {
        ...dateFilter,
        status: { [Op.or]: ["confirmed", "completed"] },
      },
      include: [{ model: Service, attributes: ["price"] }],
    });

    const revenue = revenueBookings.reduce((sum, booking) => {
      return sum + (Number(booking.Service?.price) || 0);
    }, 0);

    // 4. Status Distribution
    const statusCounts = await Booking.findAll({
      where: dateFilter,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });

    const statusDistribution = statusCounts.map((s) => ({
      name: s.status,
      value: Number(s.get("count")),
    }));

    // 5. Service Performance
    const bookingsWithService = await Booking.findAll({
      where: dateFilter,
      include: [{ model: Service, attributes: ["name", "price"] }],
    });

    const serviceStats = {};
    bookingsWithService.forEach((booking) => {
      const serviceName = booking.Service?.name || "Unknown";
      if (!serviceStats[serviceName]) {
        serviceStats[serviceName] = {
          name: serviceName,
          bookings: 0,
          revenue: 0,
        };
      }
      serviceStats[serviceName].bookings += 1;
      if (booking.status === "confirmed" || booking.status === "completed") {
        serviceStats[serviceName].revenue +=
          Number(booking.Service?.price) || 0;
      }
    });

    const servicePerformance = Object.values(serviceStats).sort(
      (a, b) => b.revenue - a.revenue,
    );

    // 6. Timeline Data (Daily for the range)
    const chartsData = [];
    // Generate all days in range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      chartsData.push({
        date: dateStr,
        name: dayLabel,
        bookings: 0,
        revenue: 0,
      });
    }

    bookingsWithService.forEach((booking) => {
      const dateStr = new Date(booking.startTime).toISOString().split("T")[0];
      const dayStat = chartsData.find((d) => d.date === dateStr);
      if (dayStat) {
        dayStat.bookings += 1;
        if (booking.status === "confirmed" || booking.status === "completed") {
          dayStat.revenue += Number(booking.Service?.price) || 0;
        }
      }
    });

    res.successResponse({
      totalBookings,
      activeServices,
      revenue,
      statusDistribution,
      servicePerformance,
      chartsData, // This will act as our specific timeline
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.serverError(error.message, "Failed to fetch stats");
  }
};

exports.getOverview = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { startDate, endDate } = req.query;

    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    // Default behavior if dates are NOT provided
    if (!startDate) {
      start.setDate(start.getDate() - 15); // 15 days before today
    }

    if (!endDate) {
      end.setDate(end.getDate() + 15); // 15 days after today
    }

    // Normalize time boundaries
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const dateFilter = {
      orgId,
      startTime: {
        [Op.between]: [start, end],
      },
    };

    // 1. Total Bookings (All Time)
    const totalBookings = await Booking.count({
      where: { orgId },
    });

    // 2. Active Services
    const activeServices = await Service.count({
      where: { orgId, isActive: true },
    });

    // 3. Total Revenue (All Time - Confirmed/Completed)
    const revenueBookings = await Booking.findAll({
      where: {
        orgId,
        status: { [Op.or]: ["confirmed", "completed"] },
      },
      include: [{ model: Service, attributes: ["price"] }],
    });

    const revenue = revenueBookings.reduce((sum, booking) => {
      return sum + (Number(booking.Service?.price) || 0);
    }, 0);

    // 4. Status Distribution
    const statusCounts = await Booking.findAll({
      where: dateFilter,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });

    const statusDistribution = statusCounts.map((s) => ({
      name: s.status,
      value: Number(s.get("count")),
    }));

    // 5. Service Performance
    const bookingsWithService = await Booking.findAll({
      where: dateFilter,
      include: [{ model: Service, attributes: ["name", "price"] }],
    });

    const serviceStats = {};
    bookingsWithService.forEach((booking) => {
      const serviceName = booking.Service?.name || "Unknown";
      if (!serviceStats[serviceName]) {
        serviceStats[serviceName] = {
          name: serviceName,
          bookings: 0,
          revenue: 0,
        };
      }
      serviceStats[serviceName].bookings += 1;
      if (booking.status === "confirmed" || booking.status === "completed") {
        serviceStats[serviceName].revenue +=
          Number(booking.Service?.price) || 0;
      }
    });

    const servicePerformance = Object.values(serviceStats).sort(
      (a, b) => b.revenue - a.revenue,
    );

    // 6. Timeline Data (Daily for the range)
    const chartsData = [];
    // Generate all days in range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      chartsData.push({
        date: dateStr,
        name: dayLabel,
        bookings: 0,
        revenue: 0,
      });
    }

    bookingsWithService.forEach((booking) => {
      const dateStr = new Date(booking.startTime).toISOString().split("T")[0];
      const dayStat = chartsData.find((d) => d.date === dateStr);
      if (dayStat) {
        dayStat.bookings += 1;
        if (booking.status === "confirmed" || booking.status === "completed") {
          dayStat.revenue += Number(booking.Service?.price) || 0;
        }
      }
    });

    const dailyStats = chartsData.map((d) => ({
      label: d.name,
      count: d.bookings,
    }));

    res.successResponse({
      totalBookings,
      activeServices,
      revenue,
      statusDistribution,
      servicePerformance,
      chartsData,
      dailyStats,
    });
  } catch (error) {
    console.error("Get Overview Error:", error);
    res.serverError(error.message, "Failed to fetch overview");
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const orgId = req.orgId; // From auth middleware, not body!
    const { name, primaryColor, content, plan, billingCycle } = req.body;

    const organization = await Organization.findByPk(orgId);
    if (!organization) {
      return res.notFound("Organization not found");
    }

    if (name) organization.name = name;
    if (primaryColor) organization.primaryColor = primaryColor;
    if (req.body.logoUrl !== undefined) organization.logoUrl = req.body.logoUrl;
    if (content) organization.content = content;

    if (req.body.contactEmail)
      organization.contactEmail = req.body.contactEmail;
    if (req.body.contactPhone)
      organization.contactPhone = req.body.contactPhone;
    if (req.body.address) organization.address = req.body.address;
    if (plan) organization.plan = plan;
    if (billingCycle) organization.billingCycle = billingCycle;
    if (req.body.onboardingCompleted !== undefined)
      organization.onboardingCompleted = req.body.onboardingCompleted;

    // Merge settings if provided
    if (req.body.settings) {
      organization.settings = {
        ...organization.settings,
        ...req.body.settings,
      };
    }

    await organization.save();

    res.successResponse({ organization }, "Organization updated successfully");
  } catch (error) {
    console.error("Update Org Error:", error);
    res.serverError(error.message, "Failed to update organization");
  }
};

exports.getSettings = async (req, res) => {
  try {
    const orgId = req.orgId;
    const organization = await Organization.findByPk(orgId);
    if (!organization) return res.notFound("Org not found");

    res.successResponse({
      name: organization.name,
      primaryColor: organization.primaryColor,
      settings: organization.settings,
      slug: organization.slug,
      logoUrl: organization.logoUrl,
      content: organization.content,
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      address: organization.address,
      plan: organization.plan,
      billingCycle: organization.billingCycle,
      subscriptionStatus: organization.subscriptionStatus,
      onboardingCompleted: organization.onboardingCompleted,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.serverError(error.message, "Failed to fetch settings");
  }
};

exports.upgradePlan = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { plan } = req.body;
    const organization = await Organization.findByPk(orgId);
    if (!organization) return res.notFound("Org not found");
    organization.plan = plan;
    await organization.save();
    res.successResponse({ organization }, "Plan upgraded successfully");
  } catch (error) {
    console.error("Upgrade Plan Error:", error);
    res.serverError(error.message, "Failed to upgrade plan");
  }
};
