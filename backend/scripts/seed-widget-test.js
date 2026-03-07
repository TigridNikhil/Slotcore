const { Organization, Service, Resource, Schedule } = require("../src/models");
const sequelize = require("../src/config/database");

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    // Create Test Organization
    const [org] = await Organization.findOrCreate({
      where: { id: "ea316315-7798-4670-89bc-9556fc62c3e4" },
      defaults: {
        name: "Acme Health",
        slug: "acme-health",
        isActive: true,
        settings: {},
      },
    });
    console.log("Org created:", org.name);

    // Create Test Service
    const [service] = await Service.findOrCreate({
      where: { id: "decc5da7-3860-482f-87d7-0f8d1e203f12" },
      defaults: {
        orgId: org.id,
        name: "General Consultation",
        durationMin: 30, // Fixed field name
        price: 50,
        isActive: true,
      },
    });
    console.log("Service created:", service.name);

    // Create a Resource (Staff)
    const [resource] = await Resource.findOrCreate({
      where: { name: "Dr. Smith", orgId: org.id },
      defaults: {
        type: "staff",
        isActive: true,
      },
    });
    console.log("Resource created:", resource.name);

    // Add Schedule for Resource
    await Schedule.findOrCreate({
      where: {
        orgId: org.id, // Added required field
        dayOfWeek: new Date().getDay(),
      },
      defaults: {
        startTime: "09:00:00",
        endTime: "17:00:00",
        isActive: true,
      },
    });
    console.log("Schedule added for today.");

    console.log(
      "\x1b[32m%s\x1b[0m",
      "Seeding successful! Refresh http://localhost:5000/test-widget.html to see slots.",
    );
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
