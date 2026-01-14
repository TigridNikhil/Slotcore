const { OrgNotificationSettings } = require("../models");

exports.getSettings = async (req, res) => {
  try {
    const orgId = req.orgId;
    if (!orgId)
      return res.status(400).json({ error: "Organization context required" });

    let settings = await OrgNotificationSettings.findOne({ where: { orgId } });
    if (!settings) {
      // Return defaults
      return res.json({
        enableSMS: false,
        enableWhatsApp: false,
        whatsappTemplateId: "",
        senderId: "",
      });
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch notification settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const orgId = req.orgId;
    if (!orgId)
      return res.status(400).json({ error: "Organization context required" });

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
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};
