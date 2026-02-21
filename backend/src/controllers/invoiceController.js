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
        { model: { model: User, as: "staff" }, attributes: ["name"] }, // Fix include syntax if needed, but keeping logic same
      ],
    });

    if (!booking) {
      return res.notFound("Booking not found");
    }

    await invoiceService.createBookingInvoice(booking, res);
  } catch (error) {
    console.error("Invoice Error:", error);
    if (!res.headersSent) {
      res.serverError(error.message, "Failed to generate invoice");
    }
  }
};
