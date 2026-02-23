const Razorpay = require("razorpay");
const crypto = require("crypto");
const PLAN_CONFIG = require("../config/planConfig");
const { Organization, BillingTransaction, sequelize } = require("../models");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Calculate prorated credit for unused days in current billing period
 */
function calculateProration(org) {
  if (!org.nextDueDate || !org.plan || !org.billingCycle) {
    return { credit: 0, remainingDays: 0 };
  }

  const now = new Date();
  const dueDate = new Date(org.nextDueDate);

  // No credit if already past due
  if (dueDate <= now) {
    return { credit: 0, remainingDays: 0 };
  }

  const remainingDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
  const currentConfig = PLAN_CONFIG[org.plan];
  if (!currentConfig) return { credit: 0, remainingDays: 0 };

  const currentPrice =
    org.billingCycle === "YEARLY"
      ? currentConfig.priceYearly
      : currentConfig.priceMonthly;

  if (!currentPrice) return { credit: 0, remainingDays: 0 };

  const totalDays = org.billingCycle === "YEARLY" ? 365 : 30;
  const dailyRate = currentPrice / totalDays;
  const credit = Math.round(remainingDays * dailyRate * 100) / 100;

  return { credit, remainingDays };
}

/**
 * Create a Razorpay order for subscription payment
 * Handles: new plan, renewal, and cycle switch with proration
 */
exports.createSubscriptionOrder = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { plan, billingCycle } = req.body;

    if (!plan || !billingCycle) {
      return res.badRequest("Plan and billing cycle are required");
    }

    const config = PLAN_CONFIG[plan];
    if (!config) {
      return res.badRequest("Invalid plan selected");
    }

    const fullPrice =
      billingCycle === "YEARLY" ? config.priceYearly : config.priceMonthly;

    if (fullPrice == null || fullPrice <= 0) {
      return res.badRequest(
        "Custom pricing — please contact sales for Enterprise plans",
      );
    }

    const org = await Organization.findByPk(orgId);
    if (!org) return res.notFound("Organization not found");

    // Determine order type and calculate amount
    let amount = fullPrice;
    let credit = 0;
    let orderType = "new"; // new | renewal | cycle_switch

    const isSamePlan = org.plan === plan;
    const isSameCycle = org.billingCycle === billingCycle;
    const hasDueDate =
      org.nextDueDate && new Date(org.nextDueDate) > new Date();

    if (isSamePlan && isSameCycle) {
      // RENEWAL — same plan, same cycle
      orderType = "renewal";
    } else if (isSamePlan && !isSameCycle && hasDueDate) {
      // CYCLE SWITCH with active subscription
      orderType = "cycle_switch";
      const proration = calculateProration(org);
      credit = proration.credit;
      amount = Math.max(1, Math.round((fullPrice - credit) * 100) / 100);
    } else {
      // NEW PLAN or UPGRADE/DOWNGRADE
      orderType = "new";
      if (hasDueDate) {
        // Credit remaining value from current plan
        const proration = calculateProration(org);
        credit = proration.credit;
        amount = Math.max(1, Math.round((fullPrice - credit) * 100) / 100);
      }
    }

    // Generate invoice number
    const count = await BillingTransaction.count({ where: { orgId } });
    const invoiceNumber = `INV-${org.slug.toUpperCase().slice(0, 6)}-${String(count + 1).padStart(4, "0")}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: invoiceNumber,
      notes: {
        orgId,
        plan,
        billingCycle,
        orderType,
        credit: credit.toFixed(2),
      },
    });

    // Calculate billing period
    const periodStart = new Date();
    const periodEnd = new Date();
    if (billingCycle === "YEARLY") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Create billing transaction record
    const transaction = await BillingTransaction.create({
      orgId,
      plan,
      billingCycle,
      amount,
      razorpayOrderId: order.id,
      status: "created",
      periodStart,
      periodEnd,
      invoiceNumber,
    });

    res.successResponse({
      order_id: order.id,
      amount,
      fullPrice,
      credit,
      orderType,
      currency: "INR",
      key_id: process.env.RAZORPAY_KEY_ID,
      transaction_id: transaction.id,
      org_name: org.name,
      org_email: org.contactEmail,
    });
  } catch (error) {
    console.error("Create Subscription Order Error:", error);
    res.serverError(error.message, "Failed to create subscription order");
  }
};

/**
 * Verify Razorpay payment and activate the subscription
 */
exports.verifySubscriptionPayment = async (req, res) => {
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
      return res.badRequest("Invalid payment signature");
    }

    // 2. Find billing transaction
    const transaction = await BillingTransaction.findOne({
      where: { razorpayOrderId: razorpay_order_id },
      transaction: t,
    });

    if (!transaction) {
      await t.rollback();
      return res.notFound("Billing transaction not found");
    }

    if (transaction.status === "paid") {
      await t.rollback();
      return res.successResponse(
        { status: "already_paid" },
        "Payment already processed",
      );
    }

    // 3. Update transaction
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    transaction.status = "paid";
    await transaction.save({ transaction: t });

    // 4. Update organization
    const org = await Organization.findByPk(transaction.orgId, {
      transaction: t,
    });

    org.plan = transaction.plan;
    org.billingCycle = transaction.billingCycle;
    org.subscriptionStatus = "ACTIVE"; // Clears TRIAL or PAST_DUE
    org.nextDueDate = transaction.periodEnd;
    await org.save({ transaction: t });

    await t.commit();

    res.successResponse(
      {
        plan: org.plan,
        billingCycle: org.billingCycle,
        subscriptionStatus: org.subscriptionStatus,
        nextDueDate: org.nextDueDate,
        invoiceNumber: transaction.invoiceNumber,
      },
      "Payment verified and plan activated",
    );
  } catch (error) {
    console.error("Verify Subscription Payment Error:", error);
    if (t && !t.finished) await t.rollback();
    res.serverError(error.message, "Payment verification failed");
  }
};

/**
 * Switch billing cycle without payment (yearly → monthly only)
 * Takes effect at next renewal
 */
exports.switchCycle = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { billingCycle } = req.body;

    if (!["MONTHLY", "YEARLY"].includes(billingCycle)) {
      return res.badRequest("Invalid billing cycle");
    }

    const org = await Organization.findByPk(orgId);
    if (!org) return res.notFound("Organization not found");

    // Only allow free switch from YEARLY → MONTHLY
    // MONTHLY → YEARLY requires payment (handled by createSubscriptionOrder)
    if (org.billingCycle === "MONTHLY" && billingCycle === "YEARLY") {
      return res.badRequest(
        "Switching to yearly requires payment. Use the upgrade flow.",
      );
    }

    org.billingCycle = billingCycle;
    await org.save();

    res.successResponse(
      {
        billingCycle: org.billingCycle,
        nextDueDate: org.nextDueDate,
      },
      "Billing cycle updated. Change takes effect at next renewal.",
    );
  } catch (error) {
    console.error("Switch Cycle Error:", error);
    res.serverError(error.message, "Failed to switch billing cycle");
  }
};

/**
 * Get billing history for the organization
 */
exports.getBillingHistory = async (req, res) => {
  try {
    const orgId = req.orgId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await BillingTransaction.findAndCountAll({
      where: { orgId },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Get org for next due date
    const org = await Organization.findByPk(orgId, {
      attributes: ["nextDueDate", "plan", "billingCycle", "subscriptionStatus"],
    });

    res.successResponse({
      transactions: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      nextDueDate: org?.nextDueDate,
    });
  } catch (error) {
    console.error("Get Billing History Error:", error);
    res.serverError(error.message, "Failed to fetch billing history");
  }
};
