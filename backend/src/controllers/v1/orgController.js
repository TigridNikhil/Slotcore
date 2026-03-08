const { Organization } = require("../../models");

const orgController = {
  getMe: async (req, res) => {
    try {
      const org = await Organization.findByPk(req.orgId, {
        attributes: [
          "id",
          "name",
          "slug",
          "contactEmail",
          "contactPhone",
          "address",
          "primaryColor",
          "logoUrl",
          "settings",
          "content",
          "plan",
          "subscriptionStatus",
        ],
      });
      if (!org) return res.notFound("Organization not found");
      return res.successResponse(org);
    } catch (error) {
      return res.serverError(error);
    }
  },

  updateMe: async (req, res) => {
    try {
      const {
        name,
        contactEmail,
        contactPhone,
        address,
        primaryColor,
        settings,
      } = req.body;
      const org = await Organization.findByPk(req.orgId);
      if (!org) return res.notFound("Organization not found");

      if (name) org.name = name;
      if (contactEmail) org.contactEmail = contactEmail;
      if (contactPhone) org.contactPhone = contactPhone;
      if (address) org.address = address;
      if (primaryColor) org.primaryColor = primaryColor;
      if (settings) org.settings = { ...org.settings, ...settings };

      await org.save();
      return res.successResponse(org, "Organization updated successfully");
    } catch (error) {
      return res.serverError(error);
    }
  },
};

module.exports = orgController;
