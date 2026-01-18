const { format } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");

/**
 * Generates a Google Calendar Event URL
 * @param {Object} booking - The booking object
 * @param {Object} service - The service object
 * @param {Object} org - The organization object
 * @returns {string} - The Google Calendar URL
 */
exports.generateGoogleCalendarLink = (booking, service, org) => {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  // Google Calendar expects dates in format: YYYYMMDDTHHmmssZ (UTC)
  const formatGoogleDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, "");
  };

  const startStr = formatGoogleDate(startTime);
  const endStr = formatGoogleDate(endTime);

  const title = encodeURIComponent(`Booking: ${service.name} at ${org.name}`);
  const details = encodeURIComponent(
    `Booking ID: ${booking.bookingId || "N/A"}\nService: ${
      service.name
    }\nOrganization: ${org.name}\n\nManage your booking: ${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/booking/${booking.id}`
  );
  const location = encodeURIComponent(org.address || "Online");

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}&sf=true&output=xml`;
};

/**
 * Generates ICS file content
 * @param {Object} booking - The booking object
 * @param {Object} service - The service object
 * @param {Object} org - The organization object
 * @returns {string} - The ICS file content
 */
exports.generateICS = (booking, service, org) => {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  // ICS Date Format: YYYYMMDDTHHmmssZ
  const formatICSDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, "");
  };

  const startStr = formatICSDate(startTime);
  const endStr = formatICSDate(endTime);
  const nowStr = formatICSDate(new Date());

  const summary = `Booking: ${service.name} at ${org.name}`;
  const description = `Booking ID: ${booking.bookingId || "N/A"}\\nService: ${
    service.name
  }\\nOrganization: ${org.name}\\n\\nManage your booking: ${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/booking/${booking.id}`;
  const location = org.address || "Online";

  // Basic ICS Structure
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Slotcore//Booking System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.id}@slotcore.com`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};
