const XLSX = require("xlsx");
const { Service } = require("../models");

// Generate and download a template Excel file
exports.downloadTemplate = (req, res) => {
  try {
    const data = [
      {
        Name: "Example Service",
        Duration: 60, // Minutes
        Price: 50.0,
        Category: "General",
        Description: "Describe the service here...",
        Locations: "Downtown, Westside", // Comma separated names
      },
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Adjust column widths
    ws["!cols"] = [
      { wch: 20 }, // Name
      { wch: 10 }, // Duration
      { wch: 10 }, // Price
      { wch: 15 }, // Category
      { wch: 30 }, // Description
      { wch: 30 }, // Locations
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Template");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Service_Import_Template.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Template Error:", error);
    res.status(500).json({ error: "Failed to generate template" });
  }
};

// Import services from uploaded Excel file
// Import services from JSON data
exports.importServices = async (req, res) => {
  try {
    const { services } = req.body;
    const orgId = req.orgId;
    const { Location } = require("../models");

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "No service data provided" });
    }

    // Fetch all locations for this org for mapping
    const orgLocations = await Location.findAll({
      where: { orgId, isActive: true },
    });

    let successCount = 0;
    let errors = [];

    for (const row of services) {
      // Validate Row
      if (!row.Name || !row.Duration || !row.Price) {
        errors.push(`Skipped row: Missing Name, Duration, or Price.`);
        continue;
      }

      try {
        const service = await Service.create({
          orgId,
          name: row.Name,
          durationMin: parseInt(row.Duration), // Note: Model field is 'durationMin'
          price: parseFloat(row.Price),
          category: row.Category || "General",
          description: row.Description || "",
          isActive: true,
        });

        // Handle Locations Mapping
        if (row.Locations) {
          const locNames = row.Locations.split(",").map((s) =>
            s.trim().toLowerCase()
          );
          const locIdsToAssign = [];

          for (const name of locNames) {
            // Find location by name (flexible check) or ID
            const match = orgLocations.find(
              (l) => l.name.toLowerCase() === name || l.id === name
            );
            if (match) locIdsToAssign.push(match.id);
          }

          if (locIdsToAssign.length > 0) {
            await service.setLocations(locIdsToAssign);
          }
        }

        successCount++;
      } catch (err) {
        console.error("Row Error:", err);
        errors.push(`Failed to create ${row.Name}: ${err.message}`);
      }
    }

    res.json({
      message: `Imported ${successCount} services successfully.`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Import Error:", error);
    res.status(500).json({ error: "Failed to process import file" });
  }
};
