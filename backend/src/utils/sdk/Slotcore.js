/**
 * Slotcore.js
 * The official JavaScript SDK for Slotcore Scheduling Infrastructure.
 */
class Slotcore {
  /**
   * @param {string} apiKey - Your Slotcore API key (sk_... or pk_...)
   * @param {Object} options
   */
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || "https://api.slotcore.com/v1";
  }

  /**
   * Availability Logic
   */
  get availability() {
    return {
      /**
       * Get available slots for a service
       * @param {Object} params { service_id, date, duration, stride }
       */
      list: async (params) => {
        const query = new URLSearchParams(params).toString();
        const response = await this._request(`/availability?${query}`);
        return response;
      },
    };
  }

  /**
   * Booking Logic
   */
  get bookings() {
    return {
      /**
       * Create a new booking
       * @param {Object} data { service_id, start_time, customer, metadata }
       */
      create: async (data) => {
        return await this._request("/bookings", {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
    };
  }

  /**
   * Internal Request Helper
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Slotcore API Error");
    }

    return result;
  }
}

// Support for both Node.js and Browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = Slotcore;
} else if (typeof window !== "undefined") {
  window.Slotcore = Slotcore;
}
