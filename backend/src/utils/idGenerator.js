const crypto = require("crypto");

/**
 * Generates a random uppercase alphanumeric string of a given length.
 * Default is 6 characters. The implementation uses crypto to ensure better randomness.
 * Format: BK-{RANDOM_6_CHARS} e.g. BK-A1B2C3
 */
exports.generateBookingId = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return `BK-${result}`;
};
