const { Review, Booking, Organization, sequelize } = require("../models");
const { Op } = require("sequelize");

// Public: Submit a review
exports.submitReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // 1. Validate Booking
    const booking = await Booking.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ error: "You can only review completed bookings" });
    }

    // 2. Check for existing review
    const existingReview = await Review.findOne({ where: { bookingId } });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this booking" });
    }

    // 3. Create Review
    // We infer organization from booking staff or create direct link if we stored orgId on booking
    // Currently Booking doesn't have orgId directly, but Organization has many Bookings.
    // Let's fetch the orgId via association or inference.
    // Wait, Organization <-> Booking relationship exists. Booking belongsTo Organization.
    // Let's verify if booking can include organization.

    // In models/index.js: Booking.belongsTo(Organization, { foreignKey: "orgId" });
    // So booking instance should have orgId if it was fetched with attributes, or just booking.orgId if column exists.

    // Safety check if orgId is present
    if (!booking.orgId) {
      // Fallback: This shouldn't happen in a valid system
      return res
        .status(500)
        .json({ error: "Booking not linked to an organization" });
    }

    const review = await Review.create({
      bookingId,
      organizationId: booking.orgId,
      customerId: booking.customerId, // Optional linking
      rating,
      comment,
      reviewerName: booking.customerName.split(" ")[0], // First name only for privacy
      status: "PENDING", // Default to pending
    });

    res
      .status(201)
      .json({ message: "Review submitted for moderation", review });
  } catch (error) {
    console.error("Submit Review Error:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};

// Public: Get Booking Info for Review Context
exports.getBookingInfoForReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({
      where: { id: bookingId },
      include: [{ model: Organization, attributes: ["name", "logoUrl"] }],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Basic security: Don't leak too much info if bookingId is guessed, but it's UUID.
    // Also, usually we'd verify a token, but for this simplified flow, UUID is the "token".

    res.json({
      customerName: booking.customerName.split(" ")[0], // First Name
      organization: booking.Organization
        ? {
            name: booking.Organization.name,
            logoUrl: booking.Organization.logoUrl,
          }
        : null,
      date: booking.startTime,
      status: booking.status,
    });
  } catch (error) {
    console.error("Get Booking Info Error:", error);
    res.status(500).json({ error: "Failed to fetch booking info" });
  }
};

// Public: Get Approved Reviews for Org
exports.getOrgReviews = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: {
        organizationId: orgId,
        status: "APPROVED",
      },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ["id", "rating", "comment", "reviewerName", "createdAt"],
    });

    res.json({
      reviews: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Vendor Dashboard: Get ALL reviews for my org (Pending, Approved, Rejected)
exports.getVendorReviews = async (req, res) => {
  try {
    const orgId = req.orgId; // From Auth Middleware
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { organizationId: orgId };
    if (status) where.status = status;

    const { count, rows } = await Review.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      // Include Booking info to show who reviewed
      // Note: Booking might not be directly associated in model definition if we didn't add it.
      // But usually we do. Let's check if we can include Booking.
      // Usually Review belongsTo Booking.
    });

    res.json({
      reviews: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get Vendor Reviews Error:", error);
    res.status(500).json({ error: "Failed to fetch vendor reviews" });
  }
};

// Admin: List All Reviews with Filters
// This is for Super Admin or Org Admin. For now, assuming Platform Admin.
exports.listReviews = async (req, res) => {
  try {
    const { status, orgId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (orgId) where.organizationId = orgId;

    const reviews = await Review.findAll({
      where,
      include: [
        { model: Organization, attributes: ["name"] },
        // { model: Booking, attributes: ["customerName", "serviceId"] } // If needed
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    console.error("List Admin Reviews Error:", error);
    res.status(500).json({ error: "Failed to list reviews" });
  }
};

// Admin: Moderate Review (Approve/Reject)
exports.moderateReview = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { action } = req.body; // "APPROVE" or "REJECT"

    if (!["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const review = await Review.findByPk(id);
    if (!review) {
      await transaction.rollback();
      return res.status(404).json({ error: "Review not found" });
    }

    const startStatus = review.status;
    const targetStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    if (startStatus === targetStatus) {
      await transaction.rollback();
      return res.json({ message: "Status already set" });
    }

    review.status = targetStatus;
    await review.save({ transaction });

    // Aggregation Logic: Only re-calc if we are interacting with APPROVED state
    // If transferring FROM Approved OR TO Approved, we need recalc.
    if (startStatus === "APPROVED" || targetStatus === "APPROVED") {
      await updateOrgRating(review.organizationId, transaction);
    }

    await transaction.commit();
    res.json({ success: true, status: review.status });
  } catch (error) {
    await transaction.rollback();
    console.error("Moderation Error:", error);
    res.status(500).json({ error: "Moderation failed" });
  }
};

// Helper: Recalculate Org Rating
async function updateOrgRating(orgId, transaction) {
  const result = await Review.findAll({
    where: { organizationId: orgId, status: "APPROVED" },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
      [sequelize.fn("COUNT", sequelize.col("id")), "count"],
    ],
    transaction,
    raw: true,
  });

  const avg = parseFloat(result[0].avgRating) || 0;
  const total = parseInt(result[0].count) || 0;

  await Organization.update(
    { averageRating: avg.toFixed(1), totalReviews: total },
    { where: { id: orgId }, transaction }
  );
}
