const { Booking, sequelize } = require("../src/models");
const { generateBookingId } = require("../src/utils/idGenerator");

async function test() {
  try {
    // Generate a dummy ID directly
    const id = generateBookingId();
    console.log("Generated ID Test:", id);
    if (!id.startsWith("BK-")) throw new Error("ID format invalid");

    console.log("SUCCESS: ID Generator works");
    process.exit(0);
  } catch (err) {
    console.error("FAIL:", err);
    process.exit(1);
  }
}

test();
