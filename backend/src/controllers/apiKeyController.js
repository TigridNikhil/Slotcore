const { ApiKey } = require("../models");
const { generateApiKey } = require("../utils/apiKeyGenerator");

const apiKeyController = {
  listKeys: async (req, res) => {
    try {
      const keys = await ApiKey.findAll({
        where: { orgId: req.orgId },
        order: [["createdAt", "DESC"]],
      });
      return res.successResponse(keys);
    } catch (error) {
      return res.serverError(error);
    }
  },

  createKey: async (req, res) => {
    try {
      const { name, type, environment } = req.body;
      const keyString = generateApiKey(type || "secret", environment || "test");

      const apiKey = await ApiKey.create({
        orgId: req.orgId,
        key: keyString,
        type: type || "secret",
        environment: environment || "test",
        name: name || `Key ${new Date().toLocaleDateString()}`,
      });

      return res.successResponse(apiKey, "API Key generated successfully");
    } catch (error) {
      return res.serverError(error);
    }
  },

  deleteKey: async (req, res) => {
    try {
      const { id } = req.params;
      await ApiKey.destroy({ where: { id, orgId: req.orgId } });
      return res.successResponse(null, "API Key deleted");
    } catch (error) {
      return res.serverError(error);
    }
  },

  toggleKey: async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      await ApiKey.update({ isActive }, { where: { id, orgId: req.orgId } });
      return res.successResponse(null, "API Key status updated");
    } catch (error) {
      return res.serverError(error);
    }
  },
};

module.exports = apiKeyController;
