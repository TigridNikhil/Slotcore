const invoiceService = require("../services/invoiceService");
const { Booking, Organization, Service, Payment, User } = require("../models");

exports.generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        { model: Service },
        { model: Organization },
        { model: Payment },
        { model: User, as: "staff", attributes: ["name"] },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await invoiceService.createBookingInvoice(booking, res);
  } catch (error) {
    console.error("Invoice Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate invoice" });
    }
  }
};
