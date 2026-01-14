const { sequelize, Booking, Organization } = require("../src/models");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

async function findBooking() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    // 1. Try to find a completed booking
    const booking = await Booking.findOne({
      where: { status: "completed" },
      include: [{ model: Organization }],
    });

    if (booking) {
      console.log("FOUND_BOOKING_ID:", booking.id);
      fs.writeFileSync("booking_id.txt", booking.id);
      return;
    }

    console.log("No completed booking found. Creating one...");

    // 2. Create data if missing
    let org = await Organization.findOne();
    if (!org) {
      org = await Organization.create({
        name: "Demo Spa",
        slug: "demospa",
        primaryColor: "#4F46E5",
      });
    }

    const bookingId = uuidv4();
    const newBooking = await Booking.create({
      id: bookingId,
      orgId: org.id,
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      startTime: new Date(),
      endTime: new Date(),
      status: "completed",
      bookingId: "BK-TEST-123",
    });

    // Explicitly update FK if needed
    newBooking.orgId = org.id;
    await newBooking.save();

    console.log("CREATED_BOOKING_ID:", newBooking.id);
    fs.writeFileSync("booking_id.txt", newBooking.id);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

findBooking();
