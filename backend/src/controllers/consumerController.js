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

    res.json({
      bookings: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    res.json({
      totalBookings,
      upcomingBookings,
      nextBookings,
    });
  } catch (error) {
    console.error("Get Consumer Stats Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { email } = req.consumer;
    const { name, mobile } = req.body;

    // Find consumer by email (req.consumer is just the decoded token payload usually, or the model instance if middleware attaches it.
    // Let's verify middleware: consumerAuth usually attaches req.consumer as the payload or model.
    // If it's the model, we can verify. If just payload, we need to fetch.
    // Looking at other methods, it uses { email } = req.consumer, implying it might be payload.
    // But cancelBooking does logic with req.consumer.
    // Let's assume we need to fetch the model to update it.

    const consumer = await require("../models").Consumer.findOne({
      where: { email },
    });

    if (!consumer) {
      return res.status(404).json({ error: "Consumer not found" });
    }

    if (name !== undefined) consumer.name = name;
    if (mobile !== undefined) consumer.mobile = mobile;

    await consumer.save();

    res.json({
      success: true,
      user: {
        name: consumer.name,
        mobile: consumer.mobile,
        email: consumer.email,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
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
      return res
        .status(404)
        .json({ error: "Booking not found or access denied" });
    }

    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.status(400).json({ error: "Cannot cancel this booking." });
    }

    booking.status = "cancelled";
    if (reason) {
      booking.notes = (booking.notes || "") + `\n[Consumer Cancel]: ${reason}`;
    }

    await booking.save();

    // Send Email
    const emailService = require("../services/emailService");
    emailService
      .sendBookingCancellation(booking, booking.Organization, reason)
      .catch((err) => console.error("Email fail", err));

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel Error:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

// Reschedule Booking
exports.rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.consumer;
    const { newStartTime } = req.body; // ISO String

    if (!newStartTime) {
      return res.status(400).json({ error: "New start time required" });
    }

    const booking = await Booking.findOne({
      where: { id, customerEmail: email },
      include: [{ model: Organization }],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Calculate duration
    const durationMs =
      new Date(booking.endTime).getTime() -
      new Date(booking.startTime).getTime();
    const start = new Date(newStartTime);
    const end = new Date(start.getTime() + durationMs);

    // Basic Availability Check (Conflict with same org/service?)
    // For simplicity/robustness, we check strict conflict for the Organization or Staff?
    // Since we don't have full slots logic here easily, we check if ANY booking overlaps for same Org & Service/Staff.
    // Ideally reuse `getAvailableSlots` logic, but that's heavy.
    // Minimal check: Is the specific resource/staff free?
    // If staffId is set, check staff. If not, check service capacity.
    // Fallback: Check strictly against same Service ID in same Org.

    // Check constraints
    const conflict = await Booking.findOne({
      where: {
        orgId: booking.orgId,
        serviceId: booking.serviceId, // Same service
        status: { [Op.ne]: "cancelled" },
        id: { [Op.ne]: id },
        [Op.and]: [
          { startTime: { [Op.lt]: end } },
          { endTime: { [Op.gt]: start } },
        ],
      },
    });

    // NOTE: This is a loose check. It doesn't account for parallel capacity (e.g. 5 slots).
    // If service has capacity > 1, this blocks valid reschedules.
    // IMPROVEMENT: Check count vs Capacity.
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
        return res.status(409).json({ error: "Slot is fully booked." });
      }
    }

    booking.startTime = start;
    booking.endTime = end;
    booking.status = "confirmed"; // Re-confirm if pending
    await booking.save();

    // Email
    const emailService = require("../services/emailService");
    emailService
      .sendBookingReschedule(booking, booking.Organization, start)
      .catch((err) => console.error("Email fail", err));

    res.json({ success: true, booking });
  } catch (error) {
    console.error("Reschedule Error:", error);
    res.status(500).json({ error: "Failed to reschedule" });
  }
};
