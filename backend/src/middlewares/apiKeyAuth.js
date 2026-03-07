const { ApiKey } = require("../models");

const apiKeyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const apiKeyHeader = req.headers["x-api-key"];

  let keyString;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    keyString = authHeader.split(" ")[1];
  } else if (apiKeyHeader) {
    keyString = apiKeyHeader;
  }

  // If no API key or doesn't match our format, proceed to next middleware (e.g., JWT auth)
  if (
    !keyString ||
    (!keyString.startsWith("sk_") && !keyString.startsWith("pk_"))
  ) {
    return next();
  }

  try {
    const apiKey = await ApiKey.findOne({
      where: { key: keyString, isActive: true },
    });

    if (!apiKey) {
      return res.unauthorized(null, "Invalid or inactive API key");
    }

    // Set context on the request
    req.orgId = apiKey.orgId;
    req.apiKey = apiKey;
    req.apiKeyType = apiKey.type;
    req.environment = apiKey.environment;

    // Update last used timestamp (async, don't block)
    apiKey.lastUsedAt = new Date();
    apiKey
      .save()
      .catch((err) =>
        console.error("Error updating API key last used at:", err),
      );

    next();
  } catch (error) {
    console.error("API Key Auth Error:", error);
    return res.serverError(error, "Authentication error");
  }
};

module.exports = apiKeyAuth;
