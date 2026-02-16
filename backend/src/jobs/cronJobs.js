const cron = require("node-cron");
const { Organization, Booking, Service, AuditLog } = require("../models");
const emailService = require("../services/emailService");
const { Op } = require("sequelize");

// Initialize Cron Jobs
const initCronJobs = () => {
  console.log("⏰ Initializing Cron Jobs...");

  // Daily Report at 20:00 (8 PM) Server Time
  cron.schedule("0 20 * * *", async () => {
    console.log("📝 Running Daily Report Job...");
    await generateDailyReports();
  });

  // Reminder Job: Every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    console.log("⏰ Running Reminder Job...");
    await sendReminders();
    await resolveStaleBookings();
  });
};

async function resolveStaleBookings() {
  try {
    const now = new Date();
    // Fetch all confirmed bookings that have ended
    const potentialStaleBookings = await Booking.findAll({
      where: {
        endTime: { [Op.lt]: now },
        status: "confirmed",
      },
      include: [
        {
          model: Organization,
          attributes: ["id", "settings"],
        },
      ],
    });

    if (potentialStaleBookings.length > 0) {
      console.log(
        `[Auto-Resolve] Checking ${potentialStaleBookings.length} past confirmed bookings.`,
      );

      for (const booking of potentialStaleBookings) {
        // 1. Determine Grace Period
        const orgSettings = booking.Organization?.settings || {};
        const gracePeriodMins = orgSettings.bookingGracePeriodMins || 10; // Default 10 mins

        // 2. Calculate Expiry Threshold
        const expiryTime = new Date(
          new Date(booking.endTime).getTime() + gracePeriodMins * 60000,
        );

        // 3. Process if past grace period
        if (now > expiryTime) {
          let newStatus = "expired";
          let action = "EXPIRE";

          if (booking.checkedIn) {
            newStatus = "awaiting_completion"; // Or 'completed' depending on workflow
            action = "AUTO_COMPLETE";
          }

          const previousStatus = booking.status;
          booking.status = newStatus;
          await booking.save();

          console.log(
            `[Auto-Resolve] Booking ${booking.id} (${booking.bookingId}) -> ${newStatus}`,
          );

          // 4. Create Audit Log
          await AuditLog.create({
            orgId: booking.orgId,
            entityId: booking.id,
            entityType: "Booking",
            action: action,
            performedBy: null, // System
            performedByEmail: "system@scheduler",
            changes: {
              previousStatus: previousStatus,
              newStatus: newStatus,
              trigger: "system_auto_resolve",
              reason:
                newStatus === "expired"
                  ? "No check-in after grace period"
                  : "Checked-in auto-complete",
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Auto-Resolve Job Error:", error);
  }
}

async function sendReminders() {
  try {
    const now = new Date();

    // 1. 24 Hours Reminder
    // Target: Bookings starting between 24h and 24h+15m from now
    const start24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const end24 = new Date(start24.getTime() + 15 * 60 * 1000);

    const bookings24 = await Booking.findAll({
      where: {
        startTime: { [Op.between]: [start24, end24] },
        status: "confirmed",
        reminder24hSent: false,
      },
    });

    for (const booking of bookings24) {
      const org = await Organization.findByPk(booking.orgId);
      const sent = await emailService.sendBookingReminder(booking, org, "24h");
      if (sent) {
        booking.reminder24hSent = true;
        await booking.save();
      }
    }

    // 2. 1 Hour Reminder
    // Target: Bookings starting between 1h and 1h+15m from now
    const start1 = new Date(now.getTime() + 60 * 60 * 1000);
    const end1 = new Date(start1.getTime() + 15 * 60 * 1000);

    const bookings1 = await Booking.findAll({
      where: {
        startTime: { [Op.between]: [start1, end1] },
        status: "confirmed",
        reminder1hSent: false,
      },
    });

    for (const booking of bookings1) {
      const org = await Organization.findByPk(booking.orgId);
      const sent = await emailService.sendBookingReminder(booking, org, "1h");
      if (sent) {
        booking.reminder1hSent = true;
        await booking.save();
      }
    }

    if (bookings24.length > 0 || bookings1.length > 0) {
      console.log(
        `[Reminders] Sent: ${bookings24.length} (24h), ${bookings1.length} (1h)`,
      );
    }
  } catch (error) {
    console.error("Reminder Job Error:", error);
  }
}

async function generateDailyReports() {
  try {
    const organizations = await Organization.findAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    for (const org of organizations) {
      if (!org.contactEmail) continue;

      // Calculate Stats
      const bookings = await Booking.findAll({
        where: {
          orgId: org.id,
          startTime: { [Op.gte]: today, [Op.lt]: tomorrow },
        },
        include: [{ model: Service, attributes: ["price"] }],
      });

      const totalBookings = bookings.length;
      if (totalBookings === 0) continue; // Skip empty days to avoid spam? Or send empty report?

      const totalRevenue = bookings.reduce(
        (sum, b) => sum + (parseFloat(b.Service?.price) || 0),
        0,
      );

      // Send Email
      await emailService.sendDailyReport(org, {
        totalBookings,
        totalRevenue: totalRevenue.toFixed(2),
      });
      console.log(`Sent report to ${org.name}`);
    }
  } catch (error) {
    console.error("Cron Job Error:", error);
  }
}

module.exports = {
  initCronJobs,
  resolveStaleBookings,
};
