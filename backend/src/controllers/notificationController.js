const { OrgNotificationSettings } = require("../models");

exports.getSettings = async (req, res) => {
  try {
    const orgId = req.orgId;
    if (!orgId) return res.badRequest(null, "Organization context required");

    let settings = await OrgNotificationSettings.findOne({ where: { orgId } });
    if (!settings) {
      // Return defaults
      return res.successResponse({
        enableSMS: false,
        enableWhatsApp: false,
        whatsappTemplateId: "",
        senderId: "",
      });
    }
    res.successResponse(settings);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Failed to fetch notification settings");
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const orgId = req.orgId;
    if (!orgId) return res.badRequest(null, "Organization context required");

    const { enableSMS, enableWhatsApp, senderId, whatsappTemplateId } =
      req.body;

    let settings = await OrgNotificationSettings.findOne({ where: { orgId } });
    if (settings) {
      await settings.update({
        enableSMS,
        enableWhatsApp,
        senderId,
        whatsappTemplateId,
      });
    } else {
      settings = await OrgNotificationSettings.create({
        orgId,
        enableSMS: enableSMS || false,
        enableWhatsApp: enableWhatsApp || false,
        senderId,
        whatsappTemplateId,
      });
    }
    res.successResponse(settings);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Failed to update settings");
  }
};
