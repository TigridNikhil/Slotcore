// ... imports
const { Organization, Booking, Service, sequelize } = require("../models");
const { Op } = require("sequelize");

exports.getPublicInfo = async (req, res) => {
  try {
    // req.tenant is set by tenantResolver
    const tenant = req.tenant;

    if (!tenant) {
      return res.status(404).json({ error: "Organization not found" });
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

    res.json({
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
    res.status(500).json({ error: "Server error" });
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
      (a, b) => b.revenue - a.revenue
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

    res.json({
      totalBookings,
      activeServices,
      revenue,
      statusDistribution,
      servicePerformance,
      chartsData, // This will act as our specific timeline
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
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
      (a, b) => b.revenue - a.revenue
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

    res.json({
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
    res.status(500).json({ error: "Failed to fetch overview" });
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const orgId = req.orgId; // From auth middleware, not body!
    const { name, primaryColor, content } = req.body;

    // Use organization from tenant resolver might be better, but we need the instance to save
    // actually req.tenant is available but it's a plain object (sometimes) depending on resolver?
    // Let's safe query by ID
    const organization = await Organization.findByPk(orgId);
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
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

    // Merge settings if provided
    if (req.body.settings) {
      organization.settings = {
        ...organization.settings,
        ...req.body.settings,
      };
    }

    await organization.save();

    res.json({ success: true, organization });
  } catch (error) {
    console.error("Update Org Error:", error);
    res.status(500).json({ error: "Failed to update organization" });
  }
};
exports.getSettings = async (req, res) => {
  try {
    const orgId = req.orgId;
    const organization = await Organization.findByPk(orgId);
    if (!organization) return res.status(404).json({ error: "Org not found" });

    res.json({
      name: organization.name,
      primaryColor: organization.primaryColor,
      settings: organization.settings,
      slug: organization.slug,
      logoUrl: organization.logoUrl,
      content: organization.content,
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      address: organization.address,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};
