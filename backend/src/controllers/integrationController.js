const { Integration } = require("../models");
const { google } = require("googleapis");

// These should be in .env
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:5000/api/integrations/google/callback";

exports.getAuthUrl = async (req, res) => {
  try {
    const { provider } = req.params;

    if (provider === "google") {
      if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        return res.serverError(null, "Google credentials not configured");
      }

      const oAuth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI,
      );

      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar.events"],
        state: JSON.stringify({ orgId: req.orgId }), // Pass orgId to callback
        prompt: "consent", // Force refresh token
      });

      return res.successResponse({ url: authUrl });
    } else if (provider === "outlook") {
      return res
        .status(501)
        .json({ success: false, message: "Outlook not yet implemented" });
    } else {
      return res.badRequest("Invalid provider");
    }
  } catch (error) {
    console.error("Auth URL Error:", error);
    res.serverError(error.message, "Failed to generate auth URL");
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
        GOOGLE_REDIRECT_URI,
      );

      const { tokens } = await oAuth2Client.getToken(code);

      let orgId;
      try {
        const stateData = JSON.parse(state);
        orgId = stateData.orgId;
      } catch (e) {
        return res.badRequest("Invalid state parameter");
      }

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

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return res.redirect(
        `${frontendUrl}/dashboard/integrations?status=success`,
      );
    }

    res.badRequest(null, "Invalid provider");
  } catch (error) {
    console.error("Callback Error:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/dashboard/integrations?status=error`);
  }
};

exports.getIntegrations = async (req, res) => {
  try {
    const orgId = req.orgId;
    const integrations = await Integration.findAll({
      where: { orgId },
      attributes: ["id", "provider", "isActive", "lastSyncAt", "createdAt"], // Don't send credentials
    });
    res.successResponse(integrations);
  } catch (error) {
    console.error("Get Integrations Error:", error);
    res.serverError(error.message, "Failed to fetch integrations");
  }
};

exports.disconnect = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { provider } = req.params;

    await Integration.destroy({
      where: { orgId, provider },
    });

    res.successResponse(null, "Disconnected successfully");
  } catch (error) {
    console.error("Disconnect Error:", error);
    res.serverError(error.message, "Failed to disconnect");
  }
};
