const PDFDocument = require("pdfkit");
const { Booking, Organization, Service, Payment, User } = require("../models");

const formatINR = (amount = 0) =>
  `₹ ${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

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

    const invoiceNo = booking.bookingId || booking.id.slice(0, 8);
    const amount = booking.Payment?.amount || booking.Service?.price || 0;

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${invoiceNo}.pdf`
    );

    doc.pipe(res);

    /* ---------------- HEADER ---------------- */

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(booking.Organization?.name || "Slotcore", {
        align: "center",
      });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Invoice / Receipt", { align: "center" })
      .moveDown(2);

    doc.fontSize(11);
    doc.text(`Invoice No: ${invoiceNo}`, { align: "right" });
    doc.text(`Invoice Date: ${new Date().toLocaleDateString("en-IN")}`, {
      align: "right",
    });
    doc.moveDown(2);

    /* ---------------- BILL TO ---------------- */

    doc.font("Helvetica-Bold").text("Bill To");
    doc.font("Helvetica");
    doc.text(booking.customerName || "-");
    doc.text(booking.customerEmail || "-");
    if (booking.customerMobile) doc.text(booking.customerMobile);
    doc.moveDown(2);

    /* ---------------- SERVICE TABLE ---------------- */

    const tableTop = doc.y;
    const colService = 50;
    const colAmount = 420;

    doc.font("Helvetica-Bold");
    doc.text("Service", colService, tableTop);
    doc.text("Amount", colAmount, tableTop, { align: "right" });

    doc
      .moveTo(colService, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    doc.font("Helvetica");
    doc.text(booking.Service?.name || "Service", colService, tableTop + 25);
    doc.text(formatINR(amount), colAmount, tableTop + 25, { align: "right" });

    doc
      .moveTo(colService, tableTop + 50)
      .lineTo(550, tableTop + 50)
      .stroke();

    /* ---------------- TOTAL ---------------- */

    doc.font("Helvetica-Bold");
    doc.text("Total", colService, tableTop + 65);
    doc.text(formatINR(amount), colAmount, tableTop + 65, { align: "right" });

    doc.moveDown(4);

    /* ---------------- PAYMENT INFO ---------------- */

    doc.font("Helvetica-Bold").text("Payment Details");
    doc.font("Helvetica");
    let statusText = booking.paymentStatus?.toUpperCase() || "PENDING";
    if (
      booking.paymentMethod === "venue" &&
      booking.paymentStatus === "unpaid"
    ) {
      statusText = "DUE AT VENUE";
    }
    doc.text(`Status: ${statusText}`);

    if (booking.Payment) {
      if (booking.Payment.paymentId)
        doc.text(`Payment ID: ${booking.Payment.paymentId}`);
      if (booking.Payment.method) doc.text(`Method: ${booking.Payment.method}`);
    } else if (booking.paymentMethod === "venue") {
      doc.text("Method: Pay at Venue");
    }

    if (booking.staff?.name) {
      doc.moveDown(1);
      doc.text(`Handled By: ${booking.staff.name}`);
    }

    /* ---------------- FOOTER ---------------- */

    doc
      .fontSize(9)
      .text(
        "This is a system generated invoice. No signature required.",
        50,
        730,
        { align: "center", width: 500 }
      );

    doc.end();
  } catch (error) {
    console.error("Invoice Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate invoice" });
    }
  }
};
