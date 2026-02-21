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

    res.successResponse(null, "Event tracked");
  } catch (error) {
    console.error("Track Error:", error);
    res.serverError(error.message, "Failed to track event");
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
      if (sequelize.options.dialect === "sqlite") {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${q}%` } },
          { address: { [Op.like]: `%${q}%` } },
        ];
      } else {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${q}%` } },
          { address: { [Op.iLike]: `%${q}%` } },
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
        "content",
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
        ["marketplaceTag", "DESC"],
        ["name", "ASC"],
      ],
    });

    res.successResponse(organizations);
  } catch (error) {
    console.error("Marketplace List Error:", error);
    res.serverError(error.message, "Failed to fetch marketplace listings");
  }
};
