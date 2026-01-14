const Razorpay = require("razorpay");
const crypto = require("crypto");
const {
  Booking,
  Payment,
  Organization,
  PlatformCommission,
  VendorLedger,
  sequelize,
  AuditLog,
} = require("../models");
const emailService = require("../services/emailService");
const { Op } = require("sequelize");
const { generateLedgerTestData } = require("../utils/mockLedgerData");
// const notificationService = require("../services/notificationService"); // To be implemented

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Validate amount
    const amount = parseFloat(booking.paymentAmount);
    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid payment amount for this booking" });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: booking.bookingId || booking.id, // Use public ID if avail
      notes: {
        bookingId: booking.id,
        orgId: booking.orgId,
      },
    };

    const order = await razorpay.orders.create(options);

    // Update Booking with Order ID
    await booking.update({ razorpayOrderId: order.id });

    res.json({
      success: true,
      order_id: order.id,
      amount: amount,
      currency: "INR",
      key_id: process.env.RAZORPAY_KEY_ID,
      booking_id: booking.id,
      // specific customer details for pre-fill could be sent too
      customer_name: booking.customerName,
      customer_email: booking.customerEmail,
      customer_contact: booking.customerMobile,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

exports.verifyPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await t.rollback();
      return res.status(400).json({ error: "Invalid signature" });
    }

    // 2. Find Booking
    const booking = await Booking.findOne({
      where: { razorpayOrderId: razorpay_order_id },
      transaction: t,
    });

    if (!booking) {
      await t.rollback();
      return res
        .status(404)
        .json({ error: "Booking not found for this order" });
    }

    if (booking.paymentStatus === "paid") {
      await t.commit();
      return res.json({ success: true, message: "Already paid" });
    }

    // 3. Create Payment Record
    const payment = await Payment.create(
      {
        bookingId: booking.id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount: booking.paymentAmount,
        status: "paid",
        method: "online", // We could fetch from Razorpay API to know specific method (card/upi), assume online for now
      },
      { transaction: t }
    );

    // 4. Commission Logic
    const grossAmount = parseFloat(booking.paymentAmount);

    // Fetch Org Commission Settings
    const commissionSettings = await PlatformCommission.findOne({
      where: { orgId: booking.orgId },
      transaction: t,
    });

    // Default 10% if not set
    let commissionRate = 10.0;
    let isFixed = false;

    if (commissionSettings) {
      if (commissionSettings.commissionType === "FIXED") {
        commissionRate = parseFloat(commissionSettings.commissionValue);
        isFixed = true;
      } else {
        commissionRate = parseFloat(commissionSettings.commissionValue);
      }
    }

    let platformFee = 0;
    if (isFixed) {
      platformFee = commissionRate;
    } else {
      platformFee = (grossAmount * commissionRate) / 100;
    }

    // Cap fee? Ensure it doesn't exceed gross?
    if (platformFee > grossAmount) platformFee = grossAmount;

    const vendorNet = grossAmount - platformFee;

    // 5. Update Booking
    await booking.update(
      {
        status: "confirmed",
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
        platformCommissionAmount: platformFee,
        vendorReceivableAmount: vendorNet,
      },
      { transaction: t }
    );

    // 6. Create Vendor Ledger Entry
    await VendorLedger.create(
      {
        orgId: booking.orgId,
        bookingId: booking.id,
        grossAmount: grossAmount,
        platformCommission: platformFee,
        netAmount: vendorNet,
        status: "UNPAID", // Payout pending
      },
      { transaction: t }
    );

    await t.commit();

    res.json({
      success: true,
      message: "Payment verified and booking confirmed",
    });

    // 7. Post-Transaction Notifications (Non-blocking)
    // Send Email
    const service = await booking.getService(); // Helper if association loaded?
    // Actually better to re-fetch with inclusions or just use what we have
    // booking.getService() is a promise provided by Sequelize if association is belongsTo
    // but we assume standard include needed usually.
    // Let's rely on basic emailService call
    try {
      // Need service details for email
      const srv = await booking.getService();
      // const org ... logic inside emailService potentially
      // Check 'emailService.sendBookingConfirmation' signature
      // It expects (booking, service, org).
      // We need to fetch/mock these.
      // For now, simpler to skip or do minimal fetch
      emailService
        .sendBookingConfirmation(booking, srv, { id: booking.orgId })
        .catch((e) => console.error("Email error", e));
    } catch (e) {
      console.error("Post-payment email error", e);
    }
  } catch (error) {
    console.error("Verify Payment Error:", error);
    if (t && !t.finished) await t.rollback();
    res.status(500).json({ error: "Payment verification failed" });
  }
};

exports.getOrgPayments = async (req, res) => {
  try {
    const orgId = req.orgId; // From authMiddleware
    if (!orgId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Booking,
          where: { orgId },
          attributes: ["id", "customerName", "startTime", "bookingId"],
        },
      ],
    });

    res.json({
      payments: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get Org Payments Error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

exports.exportLedger = async (req, res) => {
  try {
    const { orgId, startDate, endDate } = req.query;
    const whereClause = {};

    // Auth check: Admin can see any, Tenant only their own
    if (req.user.role === "admin" || req.user.role === "super_admin") {
      if (orgId) whereClause.orgId = orgId;
    } else {
      whereClause.orgId = req.user.orgId;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const transactions = await VendorLedger.findAll({
      where: whereClause,
      include: [
        {
          model: Booking,
          attributes: ["id", "customerName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const headers = [
      "Date",
      "Booking ID",
      "Customer",
      "Payment Mode",
      "Gross Amount",
      "Platform Fee",
      "Settlement Amount",
      "Direction",
      "Status",
    ];

    const csvRows = transactions.map((t) => [
      new Date(t.createdAt).toISOString().split("T")[0],
      t.Booking?.id || "-",
      `"${t.Booking?.customerName || "Customer"}"`,
      t.paymentMode,
      t.grossAmount,
      t.platformCommission,
      t.netAmount,
      t.settlementDirection === "PLATFORM_PAYS_VENDOR"
        ? "Payout (Platform -> Vendor)"
        : "Collection (Vendor -> Platform)",
      t.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    res.header("Content-Type", "text/csv");
    res.header("Content-Disposition", "attachment; filename=ledger_export.csv");
    res.send(csvContent);
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ error: "Failed to export CSV" });
  }
};

exports.sendSettlementReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const ledger = await VendorLedger.findByPk(id);

    if (!ledger) {
      return res.status(404).json({ error: "Ledger entry not found" });
    }

    if (ledger.status === "SETTLED") {
      return res.status(400).json({ error: "Already settled" });
    }

    if (ledger.settlementDirection !== "VENDOR_PAYS_PLATFORM") {
      return res.status(400).json({ error: "Reminder only for vendor debts" });
    }

    const org = await Organization.findByPk(ledger.orgId);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    await emailService.sendSettlementReminder(org, ledger, ledger.netAmount);

    res.json({ success: true, message: "Reminder sent successfully" });
  } catch (error) {
    console.error("Reminder Error:", error);
    res.status(500).json({ error: "Failed to send reminder" });
  }
};

exports.sendTotalSettlementReminder = async (req, res) => {
  try {
    const { orgId } = req.params;
    const org = await Organization.findByPk(orgId);

    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Calculate total pending
    const transactions = await VendorLedger.findAll({
      where: {
        orgId,
        status: {
          [Op.in]: ["UNPAID", "UNSETTLED"],
        },
        settlementDirection: "VENDOR_PAYS_PLATFORM",
      },
    });

    if (transactions.length === 0) {
      return res.status(400).json({ error: "No pending settlements found" });
    }

    const totalDue = transactions.reduce(
      (sum, t) => sum + parseFloat(t.netAmount),
      0
    );

    await emailService.sendMonthlySettlementReminder(
      org,
      totalDue.toFixed(2),
      transactions.length
    );

    res.json({
      success: true,
      message: `Total reminder sent for ₹${totalDue.toFixed(2)}`,
    });
  } catch (error) {
    console.error("Total Reminder Error:", error);
    res.status(500).json({ error: "Failed to send total reminder" });
  }
};

exports.generateMonthlyInvoice = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { month, year } = req.query; // e.g. ?month=1&year=2026

    let targetOrgId = orgId;
    if (orgId === "current") {
      if (!req.user || !req.user.orgId) {
        return res.status(400).json({ error: "User organization not found" });
      }
      targetOrgId = req.user.orgId;
    }

    // Security: Only Admin or the Org itself
    if (
      req.user.role !== "admin" &&
      req.user.role !== "super_admin" &&
      req.user.orgId !== targetOrgId
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const transactions = await VendorLedger.findAll({
      where: {
        orgId: targetOrgId,
        createdAt: { [Op.between]: [start, end] },
        // Invoice ALL commissions for the period, even if already deducted
        // This ensures the "Tax Invoice" cover the full platform fee revenue.
        // settlementDirection: "VENDOR_PAYS_PLATFORM",
      },
    });

    const totalCommission = transactions.reduce(
      (sum, t) => sum + parseFloat(t.platformCommission),
      0
    );

    // Fetch Org Details for Name
    const org = await Organization.findByPk(targetOrgId);

    const invoiceData = {
      invoiceId: `INV-${year}${month}-${orgId}`,
      orgId: orgId,
      orgName: org ? org.name : "Vendor Organization",
      totalAmount: totalCommission.toFixed(2),
      items: [
        {
          description: `Platform Commissions for ${month}/${year}`,
          amount: totalCommission.toFixed(2),
        },
      ],
    };

    // If detail needed, we can loop transactions.
    // For now, summary invoice.

    const invoiceService = require("../services/invoiceService");

    await invoiceService.createInvoice(invoiceData, res);
  } catch (error) {
    console.error("Invoice Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate invoice" });
    }
  }
};

exports.getLedger = async (req, res) => {
  try {
    const whereClause = {};
    if (req.user && req.user.role === "super_admin") {
      // Admin can view any org's ledger if orgId is provided
      if (req.query.orgId) {
        whereClause.orgId = req.query.orgId;
      }
      // If no orgId, maybe view all? Or restricted? Let's require orgId for now or show all.
      // For Admin Org Details page, we will pass orgId.
    } else if (req.orgId) {
      // Vendor viewing their own
      whereClause.orgId = req.orgId;
    } else {
      return res.status(403).json({ error: "Unauthorized access to ledger" });
    }

    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await VendorLedger.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Booking,
          attributes: ["customerName", "createdAt", "paymentStatus"],
        },
      ],
    });

    const totalEarnings =
      (await VendorLedger.sum("netAmount", { where: whereClause })) || 0;

    const totalGross =
      (await VendorLedger.sum("grossAmount", { where: whereClause })) || 0;

    const totalCommission =
      (await VendorLedger.sum("platformCommission", { where: whereClause })) ||
      0;

    // Pending Payout (Platform pays Vendor)
    const pendingPayout =
      (await VendorLedger.sum("netAmount", {
        where: {
          ...whereClause,
          status: "UNPAID",
          settlementDirection: "PLATFORM_PAYS_VENDOR",
        },
      })) || 0;

    // Pending Collection (Vendor pays Platform)
    const pendingCollection =
      (await VendorLedger.sum("netAmount", {
        where: {
          ...whereClause,
          status: "UNSETTLED",
          settlementDirection: "VENDOR_PAYS_PLATFORM",
        },
      })) || 0;

    res.json({
      transactions: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      stats: {
        totalEarnings,
        totalGross,
        totalCommission,
        pendingPayout,
        pendingCollection,
      },
    });
  } catch (error) {
    console.error("Failed to fetch ledger", error);
    res.status(500).json({ error: "Failed to fetch ledger" });
  }
};

exports.markSettled = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    // 1. Auth Check (Super Admin only usually)
    if (!req.user || req.user.role !== "super_admin") {
      await t.rollback();
      return res.status(403).json({ error: "Unauthorized: Admins only" });
    }

    // 2. Find Ledger Entry
    const ledger = await VendorLedger.findByPk(id, { transaction: t });
    if (!ledger) {
      await t.rollback();
      return res.status(404).json({ error: "Ledger entry not found" });
    }

    if (ledger.status === "SETTLED") {
      await t.rollback();
      return res.status(400).json({ error: "Already settled" });
    }

    // 3. Mark as Settled
    ledger.status = "SETTLED";
    ledger.settledAt = new Date();
    await ledger.save({ transaction: t });

    // 4. Create Audit Log
    const auditService = require("../services/auditService");
    await auditService.log(ledger.orgId, "Ledger", ledger.id, "SETTLE", req, {
      amount: ledger.netAmount,
      direction: ledger.settlementDirection,
    });

    await t.commit();
    res.json({ success: true, message: "Payout marked as paid", ledger });
  } catch (error) {
    console.error("Payout Valid Error:", error);
    if (t && !t.finished) await t.rollback();
    res.status(500).json({ error: "Failed to update payout status" });
  }
};

exports.exportLedgerPdf = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Fetch Org
    const org = await Organization.findByPk(orgId);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Fetch All Transactions for Ledger
    const transactions = await VendorLedger.findAll({
      where: { orgId },
      include: [
        {
          model: Booking,
          attributes: ["customerName", "bookingId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate Stats
    const totalEarnings =
      (await VendorLedger.sum("netAmount", { where: { orgId } })) || 0;
    const totalGross =
      (await VendorLedger.sum("grossAmount", { where: { orgId } })) || 0;
    const pendingPayout =
      (await VendorLedger.sum("netAmount", {
        where: {
          orgId,
          status: "UNPAID",
          settlementDirection: "PLATFORM_PAYS_VENDOR",
        },
      })) || 0;
    const pendingCollection =
      (await VendorLedger.sum("netAmount", {
        where: {
          orgId,
          status: "UNSETTLED",
          settlementDirection: "VENDOR_PAYS_PLATFORM",
        },
      })) || 0;

    // Format Data for PDF Service
    const pdfData = {
      orgName: org.name,
      orgId: org.id,
      stats: {
        totalEarnings: totalEarnings.toFixed(2),
        totalGross: totalGross.toFixed(2),
        pendingPayout: pendingPayout.toFixed(2),
        pendingCollection: pendingCollection.toFixed(2),
      },
      transactions: transactions.map((t) => ({
        date: t.createdAt,
        booking: t.Booking
          ? `${t.Booking.customerName} (#${t.Booking.bookingId || "N/A"})`
          : "N/A",
        mode: t.paymentMode === "PAY_AT_VENUE" ? "Venue" : "Online",
        gross: t.grossAmount,
        commission: t.platformCommission,
        net: t.netAmount,
        direction: t.settlementDirection,
        status: t.status,
      })),
    };

    // const data = generateLedgerTestData(55); // 50+ rows // test

    const invoiceService = require("../services/invoiceService");
    await invoiceService.createLedgerPdf(pdfData, res);
  } catch (error) {
    console.error("Ledger PDF Controller Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to export ledger PDF" });
    }
  }
};
