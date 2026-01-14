const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret_dev_key";

exports.generateBookingToken = (booking, expiresIn = "1h") => {
  return jwt.sign(
    {
      bookingId: booking.id,
      orgId: booking.orgId,
      role: "public_customer",
      email: booking.customerEmail,
    },
    JWT_SECRET,
    { expiresIn }
  );
};

exports.verifyBookingToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "public_customer") {
      throw new Error("Invalid token role");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
