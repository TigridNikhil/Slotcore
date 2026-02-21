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
} from "react-icons/fa";

const PLAN_CONFIG = {
  STARTER: {
    maxUsers: 1,
    maxLocations: 1,
    maxAppointmentsPerMonth: 200,
    features: ["Basic Booking Page", "Email Notifications", "Pay at Venue"],
  },
  GROWTH: {
    maxUsers: 5,
    maxLocations: 3,
    maxAppointmentsPerMonth: Infinity,
    features: [
      "WhatsApp Reminders",
      "Online Payments",
      "Team Management",
      "Service-level Scheduling",
    ],
  },
  BUSINESS: {
    maxUsers: 20,
    maxLocations: Infinity,
    maxAppointmentsPerMonth: Infinity,
    features: [
      "Custom Domain",
      "Advanced Analytics",
      "Priority Support",
      "White Label Branding",
    ],
  },
  ENTERPRISE: {
    maxUsers: Infinity,
    maxLocations: Infinity,
    maxAppointmentsPerMonth: Infinity,
    features: [
      "API Access",
      "Dedicated Manager",
      "Custom Integrations",
      "Unlimited Everything",
    ],
  },
};

export default function OrganizationDetail() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    locations: 0,
    appointments: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, teamRes, locationsRes, statsRes] =
          await Promise.all([
            axiosInstance.get("/organization/settings"),
            axiosInstance.get("/organization/team"),
            axiosInstance.get("/locations"),
            axiosInstance.get("/organization/stats"), // Last 30 days
          ]);

        setOrg(settingsRes.data.data);
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
    fetchData();
  }, []);

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

  const handlePlanUpgrade = async (newPlan) => {
    setUpdatingPlan(true);
    try {
      await axiosInstance.post("/organization/upgrade", { plan: newPlan });
      setOrg((prev) => ({ ...prev, plan: newPlan }));
      setShowUpgradeModal(false);
      toast.success(`Switched to ${newPlan} plan!`);
    } catch (err) {
      toast.error("Failed to upgrade plan");
    } finally {
      setUpdatingPlan(false);
    }
  };

  return (
    <div className="mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative overflow-hidden">
        {/* Subtle Background Pattern */}
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

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-bold flex items-center gap-2">
              <FaCrown className="text-primary-500" /> {currentPlan} Plan
            </div>
            <div
              className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                org.subscriptionStatus === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <FaCheckCircle /> {org.subscriptionStatus}
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <FaTimes size={24} />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Select a New Plan
              </h2>
              <p className="text-gray-500">
                Pick the plan that best fits your growing business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(PLAN_CONFIG).map(([key, config]) => (
                <div
                  key={key}
                  className={`border-2 rounded-2xl p-6 transition-all relative flex flex-col ${
                    org.plan === key
                      ? "border-primary-600 bg-primary-50 ring-2 ring-primary-200"
                      : "border-gray-100 hover:border-primary-200"
                  }`}
                >
                  {org.plan === key && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Current Plan
                    </div>
                  )}
                  <h3 className="text-xl font-black text-gray-900 mb-4">
                    {key}
                  </h3>
                  <div className="flex-1 space-y-3 mb-8">
                    {config.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs font-medium text-gray-600"
                      >
                        <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={org.plan === key || updatingPlan}
                    onClick={() => handlePlanUpgrade(key)}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      org.plan === key
                        ? "bg-gray-100 text-gray-400 cursor-default"
                        : "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-100"
                    }`}
                  >
                    {updatingPlan
                      ? "Processing..."
                      : org.plan === key
                        ? "Selected"
                        : "Switch to " + key}
                  </button>
                </div>
              ))}
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

        {/* Usage & Limits */}
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

          {/* Billing Info Holder */}
          <section className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Billing Cycle
            </h3>
            <p className="text-gray-500 mb-6 font-medium">
              Your next payment is scheduled for the next renewal date.
            </p>
            <div className="inline-flex items-center gap-2 text-primary-600 font-bold bg-primary-50 px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-100">
              {org.billingCycle === "YEARLY"
                ? "Annual Billing (Saved 20%)"
                : "Monthly Billing"}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
