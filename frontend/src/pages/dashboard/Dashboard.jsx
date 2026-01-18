import { useEffect, useState } from "react";
import Reviews from "./Reviews";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import ServicesManagement from "./ServicesManagement";
import BookingsList from "./BookingsList";
import AIContentGenerator from "./AIContentGenerator";
import AppearanceSettings from "./AppearanceSettings";
import CalendarView from "./CalendarView";
import Analytics from "./Analytics";
import CustomersList from "./crm/CustomersList";
import Integrations from "./Integrations";
import AvailabilitySettings from "./availability/AvailabilitySettings";
import LocationManagement from "./locations/LocationManagement";
import ResourcesList from "./resources/ResourcesList";
import Payments from "./Payments";
import ScanBooking from "./ScanBooking";

import NotificationSettings from "./NotificationSettings";

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
} from "react-icons/fa";
import {
  getDashboardStats,
  getOverviewStats,
} from "../../operations/dashboard/dashboardAction";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import TeamManagement from "./team/TeamManagement";
import { FaStar } from "react-icons/fa6";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { stats, loading, overview } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getOverviewStats()); // Fetch all-time stats
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
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
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
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white 
  flex flex-col shadow-xl transition-transform duration-300 ease-in-out
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center shrink-0">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-wider text-indigo-400">
              <img src="/logo.png" alt="Slotcore" className="h-8" />
              Slotcore
            </h1>
            <div className="mt-1 pl-11">
              {user.orgName && (
                <p className="text-white font-medium text-sm">{user.orgName}</p>
              )}
              <p className="text-xs text-gray-400">Tenant Dashboard</p>
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
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
        <div className="p-4 border-t border-gray-800 shrink-0">
          <div className="mb-4 px-4">
            <p className="text-sm font-semibold text-white">{user.name}</p>
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
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-4">
                    Welcome back, {user.name}!
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <h3 className="text-gray-500 text-sm font-medium uppercase">
                        Total Bookings
                      </h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? "..." : overview.totalBookings}
                      </p>
                      {/* <div className="mt-4 text-green-600 text-sm font-medium">↑ 12% from last week</div> */}
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <h3 className="text-gray-500 text-sm font-medium uppercase">
                        Active Services
                      </h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? "..." : overview.activeServices}
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <h3 className="text-gray-500 text-sm font-medium uppercase">
                        Revenue
                      </h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? "..." : `${overview.revenue}`}
                      </p>
                      {/* <div className="mt-4 text-green-600 text-sm font-medium">↑ 5% from last month</div> */}
                    </motion.div>
                  </div>

                  {/* Charts Section */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-6">
                        Booking Trends
                      </h3>
                      <div className="h-64">
                        {loading ? (
                          <div className="h-full flex items-center justify-center text-gray-400">
                            Loading chart...
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={overview.chartsData || []}
                              margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="colorBookings"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#4F46E5"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#4F46E5"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                              />
                              <Area
                                type="monotone"
                                dataKey="bookings"
                                stroke="#4F46E5"
                                fillOpacity={1}
                                fill="url(#colorBookings)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-6">
                        Revenue Overview
                      </h3>
                      <div className="h-64">
                        {loading ? (
                          <div className="h-full flex items-center justify-center text-gray-400">
                            Loading chart...
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={overview.chartsData || []}
                              margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="colorRevenue"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#10B981"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#10B981"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip
                                formatter={(value) => [`$${value}`, "Revenue"]}
                              />
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                              />
                              <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10B981"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Daily Activity Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-6">
                      Daily Activity (Last 30 Days)
                    </h3>
                    <div className="h-64">
                      {loading ? (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          Loading chart...
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={overview.dailyStats || []}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                            />
                            <XAxis dataKey="label" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="count"
                              name="Bookings"
                              fill="#4F46E5"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              }
            />
            <Route
              path="/analytics"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Analytics />
                </motion.div>
              }
            />
            <Route
              path="/calendar"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CalendarView />
                </motion.div>
              }
            />
            <Route
              path="/customers"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CustomersList />
                </motion.div>
              }
            />
            <Route
              path="/locations"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LocationManagement />
                </motion.div>
              }
            />
            <Route
              path="/integrations"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Integrations />
                </motion.div>
              }
            />
            <Route
              path="/team"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TeamManagement />
                </motion.div>
              }
            />
            <Route
              path="/services"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ServicesManagement />
                </motion.div>
              }
            />
            <Route
              path="/bookings"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookingsList />
                </motion.div>
              }
            />
            <Route
              path="/availability"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AvailabilitySettings />
                </motion.div>
              }
            />
            <Route
              path="/reviews"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Reviews />
                </motion.div>
              }
            />
            <Route
              path="/resources"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResourcesList />
                </motion.div>
              }
            />
            <Route
              path="/ai-studio"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AIContentGenerator />
                </motion.div>
              }
            />
            <Route
              path="/appearance"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AppearanceSettings />
                </motion.div>
              }
            />

            <Route
              path="/notifications"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotificationSettings />
                </motion.div>
              }
            />
            <Route
              path="/payments"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Payments />
                </motion.div>
              }
            />
            <Route
              path="/scan"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ScanBooking />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
