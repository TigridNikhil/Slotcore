import { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/baseurl";
import { toast } from "react-hot-toast";
import {
  FaBuilding,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCrown,
  FaCogs,
  FaCheckCircle,
  FaCalendarCheck,
  FaUsers,
  FaArrowUp,
  FaTimes,
  FaGem,
  FaRocket,
  FaCheck,
  FaReceipt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaSyncAlt,
} from "react-icons/fa";

const PLAN_CONFIG = {
  STARTER: {
    name: "Starter",
    icon: FaRocket,
    maxUsers: 1,
    maxLocations: 1,
    maxAppointmentsPerMonth: 200,
    priceMonthly: 499,
    priceYearly: 4999,
    features: ["Basic Booking Page", "Email Notifications", "Pay at Venue"],
    color: "gray",
  },
  GROWTH: {
    name: "Growth",
    icon: FaBuilding,
    maxUsers: 5,
    maxLocations: 3,
    maxAppointmentsPerMonth: Infinity,
    priceMonthly: 999,
    priceYearly: 9999,
    features: [
      "WhatsApp Reminders",
      "Online Payments (3% fee)",
      "Team Management",
      "Service-level Scheduling",
    ],
    color: "indigo",
    popular: true,
  },
  BUSINESS: {
    name: "Business",
    icon: FaGem,
    maxUsers: 20,
    maxLocations: Infinity,
    maxAppointmentsPerMonth: Infinity,
    priceMonthly: 1999,
    priceYearly: 19999,
    features: [
      "Custom Domain",
      "Advanced Analytics",
      "Priority Support",
      "White Label Branding",
    ],
    color: "purple",
  },
  ENTERPRISE: {
    name: "Enterprise",
    icon: FaCrown,
    maxUsers: Infinity,
    maxLocations: Infinity,
    maxAppointmentsPerMonth: Infinity,
    priceMonthly: null,
    priceYearly: null,
    features: [
      "API Access",
      "Dedicated Manager",
      "Custom Integrations",
      "Unlimited Everything",
    ],
    color: "amber",
  },
};

// Load Razorpay script dynamically
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function OrganizationDetail() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [modalBillingCycle, setModalBillingCycle] = useState("YEARLY");
  const [billingHistory, setBillingHistory] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    locations: 0,
    appointments: 0,
  });

  useEffect(() => {
    fetchData();
    fetchBillingHistory();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, teamRes, locationsRes, statsRes] = await Promise.all([
        axiosInstance.get("/organization/settings"),
        axiosInstance.get("/organization/team"),
        axiosInstance.get("/locations"),
        axiosInstance.get("/organization/stats"),
      ]);

      setOrg(settingsRes.data.data);
      setModalBillingCycle(settingsRes.data.data?.billingCycle || "MONTHLY");
      setCounts({
        users: teamRes.data.data.length,
        locations: locationsRes.data.data.length,
        appointments: statsRes.data.data.totalBookings,
      });
    } catch (err) {
      console.error("Failed to fetch organization details", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingHistory = async () => {
    setBillingLoading(true);
    try {
      const res = await axiosInstance.get("/billing/history");
      setBillingHistory(res.data.data?.transactions || []);
    } catch (err) {
      console.error("Failed to fetch billing history", err);
    } finally {
      setBillingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading profile...</div>
    );
  if (!org)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load organization data.
      </div>
    );

  const currentPlan = org.plan || "STARTER";
  const planInfo = PLAN_CONFIG[currentPlan];

  // Check if subscription is overdue or due today
  const isOverdue =
    org.subscriptionStatus === "PAST_DUE" ||
    (org.nextDueDate &&
      new Date(org.nextDueDate) <= new Date() &&
      org.subscriptionStatus !== "TRIAL");

  const isDueSoon =
    !isOverdue &&
    org.nextDueDate &&
    (() => {
      const daysUntilDue = Math.ceil(
        (new Date(org.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24),
      );
      return daysUntilDue <= 7 && daysUntilDue > 0;
    })();

  const UsageBar = ({ label, current, max, icon }) => {
    const percentage =
      max === Infinity ? 0 : Math.min((current / max) * 100, 100);
    const isOver = max !== Infinity && current >= max;

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${isOver ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-600"}`}
            >
              {icon}
            </div>
            <span className="font-bold text-gray-700">{label}</span>
          </div>
          <span className="text-sm font-medium text-gray-500">
            {current} / {max === Infinity ? "∞" : max}
          </span>
        </div>
        {max !== Infinity && (
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isOver ? "bg-red-500" : "bg-indigo-600"}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        )}
        {isOver && (
          <p className="text-xs text-red-500 mt-2 font-medium">
            Limit reached. Upgrade to add more.
          </p>
        )}
      </div>
    );
  };

  // Razorpay checkout flow — handles new plan, renewal, and cycle switch
  const startPaymentFlow = async (plan, billingCycle, description) => {
    setUpdatingPlan(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setUpdatingPlan(false);
        return;
      }

      // Create order (backend handles proration automatically)
      const orderRes = await axiosInstance.post("/billing/create-order", {
        plan,
        billingCycle,
      });

      const {
        order_id,
        amount,
        fullPrice,
        credit,
        orderType,
        key_id,
        org_name,
        org_email,
      } = orderRes.data.data;

      // Show proration info
      if (credit > 0) {
        toast(
          `Credit of ₹${credit.toFixed(0)} applied from your current plan`,
          {
            icon: "💰",
            duration: 4000,
          },
        );
      }

      const config = PLAN_CONFIG[plan];
      const desc =
        description ||
        `${config.name} Plan — ${billingCycle === "YEARLY" ? "Annual" : "Monthly"}${
          orderType === "renewal"
            ? " (Renewal)"
            : orderType === "cycle_switch"
              ? " (Cycle Switch)"
              : ""
        }`;

      const options = {
        key: key_id,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Slotify",
        description: desc,
        order_id: order_id,
        prefill: {
          name: org_name || "",
          email: org_email || "",
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async (response) => {
          try {
            const verifyRes = await axiosInstance.post("/billing/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const data = verifyRes.data.data;
            setOrg((prev) => ({
              ...prev,
              plan: data.plan,
              billingCycle: data.billingCycle,
              subscriptionStatus: data.subscriptionStatus,
              nextDueDate: data.nextDueDate,
            }));
            setShowUpgradeModal(false);
            toast.success(`Payment successful! Invoice: ${data.invoiceNumber}`);
            fetchBillingHistory();
          } catch (err) {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setUpdatingPlan(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setUpdatingPlan(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    } finally {
      setUpdatingPlan(false);
    }
  };

  // Plan upgrade via modal
  const handlePlanUpgrade = (newPlan) => {
    const config = PLAN_CONFIG[newPlan];
    const price =
      modalBillingCycle === "YEARLY" ? config.priceYearly : config.priceMonthly;

    if (price == null) {
      toast("Please contact sales for Enterprise pricing.");
      return;
    }

    startPaymentFlow(newPlan, modalBillingCycle);
  };

  // Renew current subscription
  const handleRenew = () => {
    startPaymentFlow(
      org.plan,
      org.billingCycle,
      `${planInfo.name} Plan — Renewal`,
    );
  };

  // Cycle switch
  const handleCycleSwitch = async (newCycle) => {
    if (newCycle === org.billingCycle) return;

    if (org.billingCycle === "MONTHLY" && newCycle === "YEARLY") {
      // Monthly → Yearly = requires payment with proration
      startPaymentFlow(
        org.plan,
        "YEARLY",
        `${planInfo.name} Plan — Switch to Annual`,
      );
    } else {
      // Yearly → Monthly = free switch, takes effect at renewal
      try {
        const res = await axiosInstance.post("/billing/switch-cycle", {
          billingCycle: "MONTHLY",
        });
        setOrg((prev) => ({
          ...prev,
          billingCycle: res.data.data.billingCycle,
        }));
        toast.success(
          "Switched to Monthly! Change takes effect at next renewal.",
        );
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to switch billing cycle",
        );
      }
    }
  };

  const currentPrice =
    org.billingCycle === "YEARLY"
      ? planInfo.priceYearly
      : planInfo.priceMonthly;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Overdue Payment Banner */}
   
      {/* Due Soon Warning */}
      {isDueSoon && !isOverdue && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white p-5 rounded-2xl shadow-xl shadow-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <FaCalendarAlt className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Payment Due Soon</h3>
              <p className="text-sm text-amber-100">
                Your next payment of{" "}
                <strong>₹{currentPrice?.toLocaleString("en-IN")}</strong> is due
                on <strong>{formatDate(org.nextDueDate)}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={handleRenew}
            disabled={updatingPlan}
            className="bg-white text-amber-600 px-6 py-2.5 rounded-xl font-bold hover:bg-amber-50 transition-all shadow-lg whitespace-nowrap flex items-center gap-2"
          >
            <FaSyncAlt className={updatingPlan ? "animate-spin" : ""} />
            {updatingPlan ? "Processing..." : "Renew Now"}
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-0 opacity-50"></div>

        <div className="w-24 h-24 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary-200 shrink-0 z-10">
          {org.logoUrl ? (
            <img
              src={org.logoUrl}
              alt={org.name}
              className="w-full h-full object-contain rounded-2xl"
            />
          ) : (
            org.name.charAt(0)
          )}
        </div>

        <div className="flex-1 space-y-4 z-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">{org.name}</h1>
            <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
              <FaGlobe className="text-primary-400" /> {org.slug}.slotcore.com
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-bold flex items-center gap-2">
              <FaCrown className="text-primary-500" /> {currentPlan} Plan
            </div>
            <div
              className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                org.subscriptionStatus === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : org.subscriptionStatus === "TRIAL"
                    ? "bg-indigo-100 text-indigo-700"
                    : org.subscriptionStatus === "PAST_DUE"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
              }`}
            >
              {org.subscriptionStatus === "PAST_DUE" ? (
                <FaExclamationTriangle />
              ) : (
                <FaCheckCircle />
              )}
              {org.subscriptionStatus === "TRIAL"
                ? "Free Trial"
                : org.subscriptionStatus === "PAST_DUE"
                  ? "Payment Overdue"
                  : org.subscriptionStatus}
            </div>
            <div className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-bold">
              {org.billingCycle === "YEARLY"
                ? "Annual Billing"
                : "Monthly Billing"}
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-2 z-10">
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
          >
            <FaArrowUp /> Upgrade Plan
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <FaTimes size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Choose Your Plan
              </h2>
              <p className="text-gray-500">
                Pick the plan that best fits your growing business.
              </p>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <span
                  className={`text-sm font-semibold transition-colors ${
                    modalBillingCycle === "MONTHLY"
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  Monthly
                </span>
                <button
                  onClick={() =>
                    setModalBillingCycle(
                      modalBillingCycle === "MONTHLY" ? "YEARLY" : "MONTHLY",
                    )
                  }
                  className="w-14 h-7 bg-gray-200 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full shadow-md transition-all duration-300 ${
                      modalBillingCycle === "YEARLY"
                        ? "left-8 bg-primary-500"
                        : "left-1 bg-white"
                    }`}
                  ></div>
                </button>
                <span
                  className={`text-sm font-semibold transition-colors flex items-center gap-2 ${
                    modalBillingCycle === "YEARLY"
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  Yearly
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    Save 20%
                  </span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {Object.entries(PLAN_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                const isCurrentPlan = org.plan === key;
                const price =
                  modalBillingCycle === "YEARLY"
                    ? config.priceYearly
                    : config.priceMonthly;

                return (
                  <div
                    key={key}
                    className={`border-2 rounded-2xl p-6 transition-all relative flex flex-col ${
                      isCurrentPlan
                        ? "border-primary-600 bg-primary-50 ring-2 ring-primary-200"
                        : config.popular
                          ? "border-indigo-300 bg-indigo-50/30"
                          : "border-gray-100 hover:border-primary-200"
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                        Current Plan
                      </div>
                    )}
                    {config.popular && !isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Popular
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg text-gray-600">
                        <Icon />
                      </div>
                      <h3 className="text-lg font-black text-gray-900">
                        {config.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="mb-5">
                      {price != null ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-gray-900">
                            ₹{price}
                          </span>
                          <span className="text-gray-400 text-sm">
                            /{modalBillingCycle === "YEARLY" ? "yr" : "mo"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-2xl font-black text-gray-900">
                          Custom
                        </div>
                      )}
                      {modalBillingCycle === "YEARLY" &&
                        config.priceMonthly != null && (
                          <p className="text-xs text-green-600 font-medium mt-1">
                            ₹{Math.round(config.priceYearly / 12)}/mo billed
                            yearly
                          </p>
                        )}
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-2.5 mb-6">
                      {config.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs font-medium text-gray-600"
                        >
                          <FaCheck className="text-green-500 mt-0.5 shrink-0 text-[10px]" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      <div className="text-xs text-gray-400 pt-1">
                        {config.maxUsers === Infinity
                          ? "Unlimited"
                          : config.maxUsers}{" "}
                        users ·{" "}
                        {config.maxLocations === Infinity
                          ? "Unlimited"
                          : config.maxLocations}{" "}
                        locations
                      </div>
                    </div>

                    <button
                      disabled={updatingPlan}
                      onClick={() => handlePlanUpgrade(key)}
                      className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                        isCurrentPlan && modalBillingCycle === org.billingCycle
                          ? "bg-gray-100 text-gray-400 cursor-default"
                          : key === "ENTERPRISE"
                            ? "bg-gray-900 text-white hover:bg-gray-800"
                            : "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-100"
                      }`}
                    >
                      {updatingPlan
                        ? "Processing..."
                        : isCurrentPlan &&
                            modalBillingCycle === org.billingCycle
                          ? "Current"
                          : isCurrentPlan &&
                              modalBillingCycle !== org.billingCycle
                            ? `Switch to ${modalBillingCycle === "YEARLY" ? "Annual" : "Monthly"}`
                            : key === "ENTERPRISE"
                              ? "Contact Sales"
                              : "Switch to " + config.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaCogs className="text-primary-500" /> Contact Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {org.contactEmail || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {org.contactPhone || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Address
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {org.address || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-primary-600 p-6 rounded-2xl text-white shadow-xl shadow-primary-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaCrown /> {currentPlan} Features
            </h2>
            <ul className="space-y-3">
              {planInfo.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm font-medium opacity-90"
                >
                  <FaCheckCircle className="text-primary-300" /> {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Usage, Billing & History */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              Usage & Limits
              <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest ml-2">
                Quota
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UsageBar
                label="Team Members"
                current={counts.users}
                max={planInfo.maxUsers}
                icon={<FaUsers />}
              />
              <UsageBar
                label="Active Locations"
                current={counts.locations}
                max={planInfo.maxLocations}
                icon={<FaMapMarkerAlt />}
              />
              <div className="md:col-span-2">
                <UsageBar
                  label="Monthly Appointments"
                  current={counts.appointments}
                  max={planInfo.maxAppointmentsPerMonth}
                  icon={<FaCalendarCheck />}
                />
              </div>
            </div>
          </section>

          {/* Billing Info */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCalendarCheck className="text-primary-500" /> Billing &
              Subscription
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1 space-y-2">
                <p className="text-2xl font-black text-gray-900">
                  {currentPrice != null ? `₹${currentPrice}` : "Custom"}
                  <span className="text-sm font-medium text-gray-400 ml-1">
                    /{org.billingCycle === "YEARLY" ? "year" : "month"}
                  </span>
                </p>
                {org.billingCycle === "YEARLY" && planInfo.priceMonthly && (
                  <p className="text-xs text-green-600 font-medium">
                    That's ₹{Math.round(planInfo.priceYearly / 12)}/mo — you're
                    saving 20%
                  </p>
                )}
                {org.nextDueDate && (
                  <div className="flex items-center gap-2 mt-2">
                    <FaCalendarAlt
                      className={`text-xs ${isOverdue ? "text-red-500" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-sm ${isOverdue ? "text-red-600 font-bold" : "text-gray-600"}`}
                    >
                      {isOverdue ? "Was due: " : "Next payment: "}
                      <strong
                        className={isOverdue ? "text-red-700" : "text-gray-800"}
                      >
                        {formatDate(org.nextDueDate)}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {/* Renew button when due or overdue */}
                {isOverdue && (
                  <button
                    onClick={handleRenew}
                    disabled={updatingPlan}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center gap-2"
                  >
                    <FaSyncAlt className={updatingPlan ? "animate-spin" : ""} />
                    Renew Now
                  </button>
                )}
                <button
                  onClick={() => handleCycleSwitch("MONTHLY")}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    org.billingCycle === "MONTHLY"
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => handleCycleSwitch("YEARLY")}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    org.billingCycle === "YEARLY"
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Yearly
                  {org.billingCycle !== "YEARLY" && (
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                      -20%
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Cycle switch info */}
            {org.billingCycle === "MONTHLY" && (
              <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
                💡 Switch to Yearly to save 20%. You'll get credit for remaining
                days in your current monthly period.
              </p>
            )}
          </section>

          {/* Billing History */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaReceipt className="text-primary-500" /> Billing History
              </h3>
            </div>

            {billingLoading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : billingHistory.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaReceipt className="text-2xl text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">
                  No billing history yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Transactions will appear here after your first payment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Cycle
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-center py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map((txn) => (
                      <tr
                        key={txn.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3.5 px-6 font-mono text-xs text-gray-600">
                          {txn.invoiceNumber || "—"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {formatDate(txn.createdAt)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-bold">
                            {txn.plan}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 text-xs">
                          {txn.billingCycle === "YEARLY" ? "Annual" : "Monthly"}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-gray-900">
                          ₹{Number(txn.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              txn.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : txn.status === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
