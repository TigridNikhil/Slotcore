const {
  Organization,
  MarketplaceStat,
  sequelize,
  Category,
} = require("../models");
const { Op } = require("sequelize");

exports.trackEvent = async (req, res) => {
  try {
    const { orgId, type } = req.body; // type: 'VIEW', 'CLICK', 'REDIRECT'
    const today = new Date().toISOString().split("T")[0];

    // Find or create stat record for today
    const [stat, created] = await MarketplaceStat.findOrCreate({
      where: { orgId, date: today },
      defaults: {
        views: 0,
        clicks: 0,
        redirects: 0,
      },
    });

    if (type === "VIEW") {
      await stat.increment("views");
    } else if (type === "CLICK") {
      await stat.increment("clicks");
    } else if (type === "REDIRECT") {
      await stat.increment("redirects");
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Track Error:", error);
    res.status(500).json({ error: "Failed to track event" });
  }
};

exports.listOrganizations = async (req, res) => {
  try {
    const { q, city, tag, categoryId, category } = req.query;

    const whereClause = {
      isActive: true,
      isMarketplaceVisible: true,
    };

    if (q) {
      whereClause[Op.or] = [
        // Case-insensitive search on name or address
        { name: { [Op.iLike]: `%${q}%` } }, // Postgres
        { address: { [Op.iLike]: `%${q}%` } },
      ];
      // Note: If using SQLite/MySQL, use Op.like instead of Op.iLike
      // For cross-db safety in this demo context, let's use Op.like (usually case-insensitive in MySQL, depends on collation)
      if (sequelize.options.dialect === "sqlite") {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${q}%` } },
          { address: { [Op.like]: `%${q}%` } },
        ];
      }
    }

    if (city) {
      whereClause.address = { [Op.like]: `%${city}%` };
    }

    if (tag && ["FEATURED", "NEW", "POPULAR", "NONE"].includes(tag)) {
      whereClause.marketplaceTag = tag;
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    } else if (category) {
      // Fallback to legacy string category
      whereClause.category = category;
    }

    const organizations = await Organization.findAll({
      where: whereClause,
      attributes: [
        "id",
        "name",
        "slug",
        "logoUrl",
        "primaryColor",
        "content", // Contains heroTagline etc
        "address",
        "marketplaceTag",
        "marketplaceRank",
        "category",
        "categoryId",
        "subCategory",
        "averageRating",
        "totalReviews",
      ],
      include: [
        {
          model: Category,
          as: "categoryDetails",
          attributes: ["id", "name", "slug", "icon"],
        },
      ],
      order: [
        ["marketplaceRank", "DESC"],
        ["marketplaceTag", "DESC"], // Simple alpha sort for now, or specific custom order if needed
        ["name", "ASC"],
      ],
    });

    res.json(organizations);
  } catch (error) {
    console.error("Marketplace List Error:", error);
    res.status(500).json({ error: "Failed to fetch marketplace listings" });
  }
};
