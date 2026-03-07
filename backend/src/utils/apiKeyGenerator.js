const crypto = require("crypto");

/**
 * Generates a Stripe-style API key
 * @param {('secret'|'public')} type
 * @param {('live'|'test')} env
 * @returns {string}
 */
const generateApiKey = (type, env = "test") => {
  const prefix = type === "secret" ? "sk" : "pk";
  const randomBytes = crypto.randomBytes(24).toString("hex");
  return `${prefix}_${env}_${randomBytes}`;
};

module.exports = { generateApiKey };
