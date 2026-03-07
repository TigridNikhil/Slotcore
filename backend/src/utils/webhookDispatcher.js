const axios = require("axios");
const crypto = require("crypto");
const { Webhook, WebhookEvent } = require("../models");

class WebhookDispatcher {
  /**
   * Dispatches an event to all subscribed webhooks for an organization
   * @param {string} orgId
   * @param {string} eventType e.g., 'booking.created'
   * @param {Object} data The event payload
   */
  static async dispatch(orgId, eventType, data) {
    try {
      const webhooks = await Webhook.findAll({
        where: { orgId, isActive: true },
      });

      const payload = {
        id: crypto.randomUUID(),
        object: "event",
        type: eventType,
        created: Math.floor(Date.now() / 1000),
        data: data,
      };

      for (const webhook of webhooks) {
        // Check if subscribed to this event or wildcard
        if (
          webhook.events.includes("*") ||
          webhook.events.includes(eventType)
        ) {
          this.deliver(webhook, payload);
        }
      }
    } catch (error) {
      console.error("Webhook Dispatch Error:", error);
    }
  }

  /**
   * Delivers a specific payload to a webhook endpoint
   */
  static async deliver(webhook, payload) {
    const eventLog = await WebhookEvent.create({
      webhookId: webhook.id,
      event: payload.type,
      payload: payload,
      status: "pending",
    });

    try {
      const signature = this.generateSignature(
        webhook.secret,
        JSON.stringify(payload),
      );

      const response = await axios.post(webhook.url, payload, {
        headers: {
          "Content-Type": "application/json",
          "Slotcore-Signature": signature,
          "User-Agent": "Slotcore-Webhooks/1.0",
        },
        timeout: 5000, // 5 second timeout
      });

      await eventLog.update({
        responseStatus: response.status,
        responseBody:
          typeof response.data === "string"
            ? response.data
            : JSON.stringify(response.data),
        status: "success",
      });
    } catch (error) {
      console.error(
        `Webhook Delivery Failed for ${webhook.url}:`,
        error.message,
      );

      await eventLog.update({
        responseStatus: error.response?.status,
        responseBody: error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message,
        status: "failed",
        // In a real system, we'd schedule a retry here
      });
    }
  }

  /**
   * Generates a HMAC SHA256 signature
   */
  static generateSignature(secret, payload) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");
    return `t=${timestamp},v1=${hmac}`;
  }
}

module.exports = WebhookDispatcher;
