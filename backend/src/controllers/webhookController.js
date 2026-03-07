const { Webhook, WebhookEvent } = require("../models");

const webhookController = {
  listWebhooks: async (req, res) => {
    try {
      const webhooks = await Webhook.findAll({
        where: { orgId: req.orgId },
      });
      return res.successResponse(webhooks);
    } catch (error) {
      return res.serverError(error);
    }
  },

  createWebhook: async (req, res) => {
    try {
      const { url, events, description } = req.body;
      const webhook = await Webhook.create({
        orgId: req.orgId,
        url,
        events: events || ["*"],
        description,
      });
      return res.successResponse(webhook, "Webhook created successfully");
    } catch (error) {
      return res.serverError(error);
    }
  },

  deleteWebhook: async (req, res) => {
    try {
      const { id } = req.params;
      await Webhook.destroy({ where: { id, orgId: req.orgId } });
      return res.successResponse(null, "Webhook deleted");
    } catch (error) {
      return res.serverError(error);
    }
  },

  listEvents: async (req, res) => {
    try {
      const { id } = req.params;
      const events = await WebhookEvent.findAll({
        where: { webhookId: id },
        limit: 50,
        order: [["createdAt", "DESC"]],
      });
      return res.successResponse(events);
    } catch (error) {
      return res.serverError(error);
    }
  },
};

module.exports = webhookController;
