const { Integration } = require("../models");
const { google } = require("googleapis");

// These should be in .env
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  "http://localhost:5000/api/integrations/google/callback";

exports.getAuthUrl = async (req, res) => {
  try {
    const { provider } = req.params;

    if (provider === "google") {
      if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        return res
          .status(500)
          .json({ error: "Google credentials not configured" });
      }

      const oAuth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
      );

      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar.events"],
        state: JSON.stringify({ orgId: req.orgId }), // Pass orgId to callback
        prompt: "consent", // Force refresh token
      });

      return res.json({ url: authUrl });
    } else if (provider === "outlook") {
      // Outlook logic placeholder
      return res.status(501).json({ error: "Outlook not yet implemented" });
    } else {
      return res.status(400).json({ error: "Invalid provider" });
    }
  } catch (error) {
    console.error("Auth URL Error:", error);
    res.status(500).json({ error: "Failed to generate auth URL" });
  }
};

exports.callback = async (req, res) => {
  try {
    const { provider } = req.params;
    const { code, state } = req.query;

    if (provider === "google") {
      const oAuth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
      );

      const { tokens } = await oAuth2Client.getToken(code);

      let orgId;
      try {
        const stateData = JSON.parse(state);
        orgId = stateData.orgId;
      } catch (e) {
        return res.status(400).json({ error: "Invalid state parameter" });
      }

      // Save or Update Integration
      // Check if one exists
      const [integration, created] = await Integration.findOrCreate({
        where: { orgId, provider: "google" },
        defaults: {
          credentials: tokens,
          isActive: true,
        },
      });

      if (!created) {
        integration.credentials = tokens;
        integration.isActive = true;
        await integration.save();
      }

      // Redirect to frontend
      return res.redirect(
        "http://localhost:5173/dashboard/integrations?status=success"
      );
    }

    res.status(400).json({ error: "Invalid provider" });
  } catch (error) {
    console.error("Callback Error:", error);
    res.redirect("http://localhost:5173/dashboard/integrations?status=error");
  }
};

exports.getIntegrations = async (req, res) => {
  try {
    const orgId = req.orgId;
    const integrations = await Integration.findAll({
      where: { orgId },
      attributes: ["id", "provider", "isActive", "lastSyncAt", "createdAt"], // Don't send credentials
    });
    res.json(integrations);
  } catch (error) {
    console.error("Get Integrations Error:", error);
    res.status(500).json({ error: "Failed to fetch integrations" });
  }
};

exports.disconnect = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { provider } = req.params;

    await Integration.destroy({
      where: { orgId, provider },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Disconnect Error:", error);
    res.status(500).json({ error: "Failed to disconnect" });
  }
};
