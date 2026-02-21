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
      return res.notFound("Booking not found");
    }

    if (booking.status !== "completed") {
      return res.badRequest("You can only review completed bookings");
    }

    // 2. Check for existing review
    const existingReview = await Review.findOne({ where: { bookingId } });
    if (existingReview) {
      return res.badRequest("You have already reviewed this booking");
    }

    // 3. Create Review
    if (!booking.orgId) {
      return res.serverError(null, "Booking not linked to an organization");
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

    res.status(201).successResponse(review, "Review submitted for moderation");
  } catch (error) {
    console.error("Submit Review Error:", error);
    res.serverError(error.message, "Failed to submit review");
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
      return res.notFound("Booking not found");
    }

    res.successResponse({
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
    res.serverError(error.message, "Failed to fetch booking info");
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

    res.successResponse({
      reviews: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.serverError(error.message, "Failed to fetch reviews");
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
    });

    res.successResponse({
      reviews: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get Vendor Reviews Error:", error);
    res.serverError(error.message, "Failed to fetch vendor reviews");
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
      include: [{ model: Organization, attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.successResponse(reviews);
  } catch (error) {
    console.error("List Admin Reviews Error:", error);
    res.serverError(error.message, "Failed to list reviews");
  }
};

// Admin: Moderate Review (Approve/Reject)
exports.moderateReview = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { action } = req.body; // "APPROVE" or "REJECT"

    if (!["APPROVE", "REJECT"].includes(action)) {
      await transaction.rollback();
      return res.badRequest("Invalid action");
    }

    const review = await Review.findByPk(id);
    if (!review) {
      await transaction.rollback();
      return res.notFound("Review not found");
    }

    const startStatus = review.status;
    const targetStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    if (startStatus === targetStatus) {
      await transaction.rollback();
      return res.successResponse(
        { status: review.status },
        "Status already set",
      );
    }

    review.status = targetStatus;
    await review.save({ transaction });

    // Aggregation Logic: Only re-calc if we are interacting with APPROVED state
    if (startStatus === "APPROVED" || targetStatus === "APPROVED") {
      await updateOrgRating(review.organizationId, transaction);
    }

    await transaction.commit();
    res.successResponse({ success: true, status: review.status });
  } catch (error) {
    await transaction.rollback();
    console.error("Moderation Error:", error);
    res.serverError(error.message, "Moderation failed");
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
    { where: { id: orgId }, transaction },
  );
}
