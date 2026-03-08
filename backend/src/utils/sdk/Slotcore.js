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
    if (!apiKey) {
      throw new Error("Slotcore API Key is required.");
    }
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || "https://api.slotcore.com/v1";
    this.tenantSlug = options.tenantSlug || null;
  }

  /**
   * Availability Logic
   */
  get availability() {
    return {
      /**
       * Get available slots for a service
       * @param {Object} params { serviceId, date, duration, stride }
       */
      list: async (params) => {
        const query = new URLSearchParams(params).toString();
        return await this._request(`/availability?${query}`);
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
       * @param {Object} data { serviceId, startTime, customerName, customerEmail, notes }
       */
      create: async (data) => {
        return await this._request("/bookings", {
          method: "POST",
          body: JSON.stringify(data),
        });
      },

      /**
       * Get booking details
       * @param {string} id
       */
      get: async (id) => {
        return await this._request(`/bookings/${id}`);
      },

      /**
       * Cancel a booking
       * @param {string} id
       */
      cancel: async (id) => {
        return await this._request(`/bookings/${id}/cancel`, {
          method: "PUT",
        });
      },
    };
  }

  /**
   * Service Logic
   */
  get services() {
    return {
      /**
       * List all active services
       */
      list: async () => {
        return await this._request("/services");
      },
    };
  }

  /**
   * Customer Logic
   */
  get customers() {
    return {
      /**
       * List customers (requires Secret Key)
       */
      list: async () => {
        return await this._request("/customers");
      },

      /**
       * Get customer by ID
       * @param {string} id
       */
      get: async (id) => {
        return await this._request(`/customers/${id}`);
      },
    };
  }

  /**
   * Organization Logic
   */
  get organization() {
    return {
      /**
       * Get public organization info
       */
      getPublic: async () => {
        return await this._request("/organization/public");
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
      "X-Requested-With": "Slotcore-JS-SDK",
    };

    if (this.tenantSlug) {
      headers["X-Tenant-Slug"] = this.tenantSlug;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const result = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: result.message || result.error || "Slotcore API Error",
          data: result,
        };
      }

      return result;
    } catch (error) {
      if (error.status) throw error;
      throw new Error(`Connection Error: ${error.message}`);
    }
  }
}

// Support for both Node.js and Browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = Slotcore;
} else if (typeof window !== "undefined") {
  window.Slotcore = Slotcore;
}
