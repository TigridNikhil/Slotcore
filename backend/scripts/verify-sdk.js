const Slotcore = require("../src/utils/sdk/Slotcore");

async function verifySDK() {
  console.log("Verifying Slotcore SDK Implementation...");

  try {
    const slotcore = new Slotcore("sk_test_12345", {
      baseUrl: "http://localhost:5000/api/v1",
    });

    console.log("- SDK initialization: SUCCESS");

    // Check availability module
    if (typeof slotcore.availability.list === "function") {
      console.log("- Availability module: SUCCESS");
    }

    // Check bookings module
    if (
      typeof slotcore.bookings.create === "function" &&
      typeof slotcore.bookings.cancel === "function"
    ) {
      console.log("- Bookings module: SUCCESS");
    }

    // Check services module
    if (typeof slotcore.services.list === "function") {
      console.log("- Services module: SUCCESS");
    }

    // Check customers module
    if (
      typeof slotcore.customers.list === "function" &&
      typeof slotcore.customers.get === "function"
    ) {
      console.log("- Customers module: SUCCESS");
    }

    console.log("\nSDK verification complete!");
  } catch (error) {
    console.error("- Verification FAILED:", error.message);
    process.exit(1);
  }
}

verifySDK();
