const { Booking, Organization, Service, sequelize } = require("../models");
const { Op } = require("sequelize");

// List all bookings for the consumer across ALL organizations
exports.getMyBookings = async (req, res) => {
  try {
    const { email } = req.consumer;
    const { status, limit = 20, page = 1, date } = req.query;

    const whereClause = {
      customerEmail: email,
    };

    if (status) {
      whereClause.status = status;
    }

    if (date) {
      // Filter by start/end of the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.startTime = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    // Pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Organization,
          attributes: ["id", "name", "slug", "logoUrl"],
        },
        {
          model: Service,
          attributes: ["name", "durationMin", "price"],
        },
      ],
      order: [["startTime", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.successResponse({
      bookings: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    res.serverError(error.message, "Internal Server Error");
  }
};

// Get aggregated stats
exports.getConsumerStats = async (req, res) => {
  try {
    const { email } = req.consumer;

    const totalBookings = await Booking.count({
      where: { customerEmail: email },
    });

    // Upcoming bookings count
    const upcomingBookings = await Booking.count({
      where: {
        customerEmail: email,
        startTime: { [Op.gte]: new Date() },
        status: { [Op.ne]: "cancelled" },
      },
    });

    // Next 3 bookings details
    const nextBookings = await Booking.findAll({
      where: {
        customerEmail: email,
        startTime: { [Op.gte]: new Date() },
        status: { [Op.ne]: "cancelled" },
      },
      include: [
        {
          model: Organization,
          attributes: ["id", "name", "slug", "logoUrl"],
        },
        {
          model: Service,
          attributes: ["name", "durationMin", "price"],
        },
      ],
      order: [["startTime", "ASC"]],
      limit: 3,
    });

    res.successResponse({
      totalBookings,
      upcomingBookings,
      nextBookings,
    });
  } catch (error) {
    console.error("Get Consumer Stats Error:", error);
    res.serverError(error.message, "Internal Server Error");
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { email } = req.consumer;
    const { name, mobile } = req.body;

    const consumer = await require("../models").Consumer.findOne({
      where: { email },
    });

    if (!consumer) {
      return res.notFound("Consumer not found");
    }

    if (name !== undefined) consumer.name = name;
    if (mobile !== undefined) consumer.mobile = mobile;

    await consumer.save();

    res.successResponse(
      {
        name: consumer.name,
        mobile: consumer.mobile,
        email: consumer.email,
      },
      "Profile updated successfully",
    );
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.serverError(error.message, "Failed to update profile");
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const consumerData = req.consumer.toJSON
      ? req.consumer.toJSON()
      : req.consumer;
    const { id, email, name, mobile } = consumerData;

    res.successResponse({ id, email, name, mobile });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.serverError(error.message, "Failed to fetch profile");
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.consumer;
    const { reason } = req.body;

    const booking = await Booking.findOne({
      where: { id, customerEmail: email },
      include: [{ model: Organization }],
    });

    if (!booking) {
      return res.notFound("Booking not found or access denied");
    }

    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.badRequest("Cannot cancel this booking.");
    }

    booking.status = "cancelled";
    if (reason) {
      booking.notes = (booking.notes || "") + `\n[Consumer Cancel]: ${reason}`;
    }

    await booking.save();

    const emailService = require("../services/emailService");
    emailService
      .sendBookingCancellation(booking, booking.Organization, reason)
      .catch((err) => console.error("Email fail", err));

    res.successResponse(null, "Booking cancelled successfully");
  } catch (error) {
    console.error("Cancel Error:", error);
    res.serverError(error.message, "Failed to cancel booking");
  }
};

// Reschedule Booking
exports.rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.consumer;
    const { newStartTime } = req.body; // ISO String

    if (!newStartTime) {
      return res.badRequest("New start time required");
    }

    const booking = await Booking.findOne({
      where: { id, customerEmail: email },
      include: [{ model: Organization }],
    });

    if (!booking) {
      return res.notFound("Booking not found");
    }

    const durationMs =
      new Date(booking.endTime).getTime() -
      new Date(booking.startTime).getTime();
    const start = new Date(newStartTime);
    const end = new Date(start.getTime() + durationMs);

    const service = await Service.findByPk(booking.serviceId);
    if (service) {
      const capacity = service.capacity || 1;
      const count = await Booking.count({
        where: {
          orgId: booking.orgId,
          serviceId: booking.serviceId,
          status: { [Op.ne]: "cancelled" },
          id: { [Op.ne]: id },
          [Op.and]: [
            { startTime: { [Op.lt]: end } },
            { endTime: { [Op.gt]: start } },
          ],
        },
      });

      if (count >= capacity) {
        return res
          .status(409)
          .json({ success: false, message: "Slot is fully booked." });
      }
    }

    booking.startTime = start;
    booking.endTime = end;
    booking.status = "confirmed";
    await booking.save();

    const emailService = require("../services/emailService");
    emailService
      .sendBookingReschedule(booking, booking.Organization, start)
      .catch((err) => console.error("Email fail", err));

    res.successResponse(booking, "Booking rescheduled successfully");
  } catch (error) {
    console.error("Reschedule Error:", error);
    res.serverError(error.message, "Failed to reschedule");
  }
};
