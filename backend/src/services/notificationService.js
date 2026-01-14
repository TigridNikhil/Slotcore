const { OrgNotificationSettings } = require("../models");

// Mock Twilio/Meta Clients
// const twilio = require('twilio')(accountSid, authToken);

exports.sendSMS = async (orgId, mobile, message) => {
  try {
    const settings = await OrgNotificationSettings.findOne({
      where: { orgId },
    });
    if (!settings || !settings.enableSMS) {
      console.log(`[Notification] SMS disabled for Org ${orgId}`);
      return;
    }

    // Replace with real provider logic
    console.log(`[Notification] SENDING SMS to ${mobile}: "${message}"`);
    // await twilio.messages.create(...)
  } catch (error) {
    console.error("[Notification] SMS Error:", error);
  }
};

exports.sendWhatsApp = async (orgId, mobile, templateId, parameters) => {
  try {
    const settings = await OrgNotificationSettings.findOne({
      where: { orgId },
    });
    if (!settings || !settings.enableWhatsApp) {
      console.log(`[Notification] WhatsApp disabled for Org ${orgId}`);
      return;
    }

    // Replace with real provider logic
    console.log(
      `[Notification] SENDING WHATSAPP to ${mobile} (Template: ${templateId})`
    );
  } catch (error) {
    console.error("[Notification] WhatsApp Error:", error);
  }
};

// Centralized Notification Trigger (Optional wrapper)
exports.notifyBookingConfirmation = async (booking) => {
  if (booking.customerMobile) {
    await exports.sendSMS(
      booking.orgId,
      booking.customerMobile,
      `Your booking for ${booking.startTime} is confirmed!`
    );
    await exports.sendWhatsApp(
      booking.orgId,
      booking.customerMobile,
      "booking_confirmed_template",
      { name: booking.customerName, time: booking.startTime }
    );
  }
};
