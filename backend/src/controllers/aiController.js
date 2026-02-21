const OpenAI = require("openai");
const { Organization, Service } = require("../models");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateSiteContent = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { tone, context } = req.body; // Context can be null
    const organization = await Organization.findByPk(orgId, {
      include: [{ model: Service, attributes: ["name"] }],
    });

    if (!organization) {
      return res.notFound("Organization not found");
    }

    const serviceNames = organization.Services.map((s) => s.name).join(", ");

    const systemPrompt = `You are an expert copywriter. You must output valid JSON only.`;
    const userPrompt = `
      Business Name: ${organization.name}
      Location: "Local Area" (Generic if unknown)
      Services: ${serviceNames}
      Tone: ${tone || "Professional"}
      Additional Context: ${context || "None provided"}

      Generate website content in strict JSON format with these exact keys:
      {
        "heroTagline": "Catchy 5-10 word headline",
        "heroSubheadline": "Supporting 10-20 word sentence",
        "aboutUs": "A 50-75 word description",
        "testimonials": [
            { "name": "Customer Name", "text": "Short positive review (20-30 words)", "rating": 5 }
        ],
        "faqs": [
            { "question": "Common question?", "answer": "Helpful answer" }
        ]
      }
      Generate 3 testimonials and 3 FAQs.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = JSON.parse(completion.choices[0].message.content);

    // Update Organization
    organization.content = { ...organization.content, ...content };
    await organization.save();

    res.successResponse(organization.content);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.serverError(error.message, "Failed to generate content");
  }
};

exports.generateServiceDescriptions = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { tone } = req.body;
    const services = await Service.findAll({ where: { orgId } });

    if (services.length === 0) {
      return res.badRequest(
        null,
        "No services found to generate descriptions for.",
      );
    }

    const serviceList = services.map((s) => s.name).join(", ");

    const systemPrompt = `You are an expert copywriter. Output valid JSON only.`;
    const userPrompt = `
      Generate attractive 30-word descriptions for these services: ${serviceList}.
      Tone: ${tone || "Professional"}.
      Output strict JSON where keys are the exact service names and values are the descriptions.
      Example: { "Service Name": "Description..." }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    console.log("AI Response:", completion.choices[0].message.content);
    const descriptions = JSON.parse(completion.choices[0].message.content);
    console.log("Parsed Descriptions:", descriptions);

    // Update services
    const updatePromises = services.map(async (service) => {
      // Try exact match then case-insensitive match
      let desc = descriptions[service.name];
      if (!desc) {
        const key = Object.keys(descriptions).find(
          (k) => k.toLowerCase() === service.name.toLowerCase(),
        );
        if (key) desc = descriptions[key];
      }

      if (desc) {
        console.log(`Updating service: ${service.name}`);
        service.description = desc;
        await service.save();
      } else {
        console.log(`No description found for service: ${service.name}`);
      }
    });

    await Promise.all(updatePromises);
    console.log("All services updated.");

    res.successResponse(
      {
        descriptions,
      },
      "Service descriptions updated.",
    );
  } catch (error) {
    console.error("AI Service Desc Error:", error);
    res.serverError(error.message, "Failed to generate service descriptions");
  }
};
