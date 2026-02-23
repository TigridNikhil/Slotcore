import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/baseurl";
import { applyTheme } from "../../utils/themeUtils";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

import {
  FaCalendarAlt,
  FaConciergeBell,
  FaSignOutAlt,
  FaChartPie,
  FaMagic,
  FaPalette,
  FaBars,
  FaTimes,
  FaCalendar,
  FaChartLine,
  FaPlug,
  FaClock,
  FaUsers,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaQrcode,
  FaGem,
  FaExclamationTriangle,
  FaRocket,
} from "react-icons/fa";
import {
  getDashboardStats,
  getOverviewStats,
} from "../../operations/dashboard/dashboardAction";
import { FaStar } from "react-icons/fa6";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscriptionBanner, setSubscriptionBanner] = useState(null); // { type, daysLeft, dueDate }
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const { stats, loading, overview } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getOverviewStats());

    const fetchTheme = async () => {
      try {
        const res = await axiosInstance.get("/organization/settings");
        if (res.data.data?.primaryColor) {
          applyTheme(res.data.data.primaryColor);
        }
        // Determine subscription banner state
        const d = res.data.data;
        if (d?.subscriptionStatus === "PAST_DUE") {
          setSubscriptionBanner({ type: "overdue", dueDate: d.nextDueDate });
        } else if (d?.subscriptionStatus === "TRIAL" && d?.trialEndsAt) {
          const daysLeft = Math.max(
            0,
            Math.ceil(
              (new Date(d.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24),
            ),
          );
          setSubscriptionBanner({ type: "trial", daysLeft });
        } else if (
          d?.subscriptionStatus === "ACTIVE" &&
          d?.trialEndsAt &&
          new Date(d.trialEndsAt) < new Date() &&
          (!d?.plan || d?.plan === "STARTER")
        ) {
          setSubscriptionBanner({ type: "trial_expired" });
        }
      } catch (err) {
        console.error("Failed to fetch theme settings", err);
      }
    };
    fetchTheme();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  console.log("overview", overview);

  // Redirect staff to bookings if on overview
  useEffect(() => {
    if (user.role === "staff" && location.pathname === "/dashboard") {
      navigate("/dashboard/bookings");
    }
  }, [user.role, location.pathname, navigate]);

  const allNavItems = [
    {
      label: "Overview",
      path: "/dashboard",
      icon: <FaChartPie />,
      roles: ["admin", "org_admin", "super_admin"],
    },
    {
      label: "Bookings",
      path: "/dashboard/bookings",
      icon: <FaCalendarAlt />,
      roles: ["admin", "org_admin", "staff"],
    },
    {
      label: "Scan Booking",
      path: "/dashboard/scan",
      icon: <FaQrcode />,
      roles: ["admin", "org_admin", "staff"],
    },
    {
      label: "Calendar",
      path: "/dashboard/calendar",
      icon: <FaCalendar />,
      roles: ["admin", "org_admin", "staff"],
    },
    {
      label: "Payments",
      path: "/dashboard/payments",
      icon: <FaChartLine />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Customers",
      path: "/dashboard/customers",
      icon: <FaUsers />,
      roles: ["admin", "org_admin", "staff"],
    },
    {
      label: "Services",
      path: "/dashboard/services",
      icon: <FaConciergeBell />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Team",
      path: "/dashboard/team",
      icon: <FaUsers />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Locations",
      path: "/dashboard/locations",
      icon: <FaMapMarkerAlt />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Analytics",
      path: "/dashboard/analytics",
      icon: <FaChartLine />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Reviews",
      path: "/dashboard/reviews",
      icon: <FaStar />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Availability",
      path: "/dashboard/availability",
      icon: <FaClock />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Resources",
      path: "/dashboard/resources",
      icon: <FaBoxOpen />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "AI Studio",
      path: "/dashboard/ai-studio",
      icon: <FaMagic />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Integrations",
      path: "/dashboard/integrations",
      icon: <FaPlug />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Appearance",
      path: "/dashboard/appearance",
      icon: <FaPalette />,
      roles: ["admin", "org_admin"],
    },
    {
      label: "Notifications",
      path: "/dashboard/notifications",
      icon: <FaConciergeBell />,
      roles: ["admin", "org_admin"],
    },
    // {
    //   label: "Organization",
    //   path: "/dashboard/organization",
    //   icon: <FaBuilding />,
    //   roles: ["admin", "org_admin"],
    // },
  ];

  // Filter items visible to this user
  const navItems = allNavItems.filter((item) => {
    if (!item.roles) return true;
    // Map 'admin' in code to 'org_admin' logic if strictly checking DB roles
    // DB uses: org_admin, staff, super_admin.
    // Front-end user object usually has 'role'.
    return item.roles.includes(user.role);
  });

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed bg-white inset-y-0 left-0 z-30 w-64 text-black 
  flex flex-col shadow-xl transition-transform duration-300 ease-in-out
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center shrink-0">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-wider">
              <img src="/logo.png" alt="Slotcore" className="h-8" />
              Slotcore
            </h1>
            <div
              className="mt-1 pl-11"
              onClick={() => navigate("/dashboard/organization")}
            >
              {user.orgName && (
                <p className="text-black font-medium text-sm">{user.orgName}</p>
              )}
              {/* <p className="text-xs text-gray-400">Tenant Dashboard</p> */}
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* ✅ Scrollable Nav */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/dashboard" &&
                location.pathname.startsWith(item.path));

            return (
              <Link key={item.path} to={item.path} className="block">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-900/50"
                      : "text-gray-800 hover:bg-gray-300 hover:text-black"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 shadow-lg shadow-gray-200 shrink-0">
          <div className="mb-4 px-4">
            <p className="text-sm font-semibold text-black">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center
      bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white
      px-4 py-2 rounded transition-all duration-200"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <FaBars size={24} />
          </button>
          <span className="font-bold text-gray-900">Dashboard</span>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
        {/* Subscription Status Banner */}
        {subscriptionBanner && !bannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 rounded-2xl p-4 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${
              subscriptionBanner.type === "overdue"
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : subscriptionBanner.type === "trial_expired"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
            }`}
          >
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {subscriptionBanner.type === "overdue" ? (
                  <FaExclamationTriangle className="text-lg" />
                ) : subscriptionBanner.type === "trial_expired" ? (
                  <FaRocket className="text-lg" />
                ) : (
                  <FaGem className="text-lg" />
                )}
              </div>
              <div>
                {subscriptionBanner.type === "trial" && (
                  <>
                    <p className="font-bold text-sm">
                      Free Trial — {subscriptionBanner.daysLeft} day
                      {subscriptionBanner.daysLeft !== 1 ? "s" : ""} remaining
                    </p>
                    <p className="text-xs text-white/80">
                      You have full access to all Business features during your
                      trial.
                    </p>
                  </>
                )}
                {subscriptionBanner.type === "trial_expired" && (
                  <>
                    <p className="font-bold text-sm">
                      Your Free Trial Has Ended
                    </p>
                    <p className="text-xs text-white/80">
                      Subscribe to a plan to continue using premium features
                      like WhatsApp reminders, online payments, and more.
                    </p>
                  </>
                )}
                {subscriptionBanner.type === "overdue" && (
                  <>
                    <p className="font-bold text-sm">Payment Overdue</p>
                    <p className="text-xs text-white/80">
                      Your subscription payment was due on{" "}
                      {subscriptionBanner.dueDate
                        ? new Date(
                            subscriptionBanner.dueDate,
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "a past date"}
                      . Renew now to avoid service interruption.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard/organization")}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap ${
                  subscriptionBanner.type === "overdue"
                    ? "bg-white text-red-600 hover:bg-red-50"
                    : subscriptionBanner.type === "trial_expired"
                      ? "bg-white text-amber-600 hover:bg-amber-50"
                      : "bg-white text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                {subscriptionBanner.type === "overdue"
                  ? "Pay Now"
                  : subscriptionBanner.type === "trial_expired"
                    ? "Choose a Plan"
                    : "Upgrade Now"}
              </button>
              {subscriptionBanner.type !== "overdue" && (
                <button
                  onClick={() => setBannerDismissed(true)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
