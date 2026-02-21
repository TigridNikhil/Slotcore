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
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  FaCalendarCheck,
  FaConciergeBell,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
} from "react-icons/fa";
import {
  getDashboardStats,
  getOverviewStats,
} from "../../operations/dashboard/dashboardAction";
import { axiosInstance } from "../../utils/baseurl";
import { applyTheme } from "../../utils/themeUtils";
import { useDispatch, useSelector } from "react-redux";

const OrgHome = () => {
  const { stats, loading, overview } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getOverviewStats());

    const fetchTheme = async () => {
      try {
        const res = await axiosInstance.get("/organization/settings");
        if (res.data.data?.primaryColor) {
          applyTheme(res.data.data.primaryColor);
        }
      } catch (err) {
        console.error("Failed to fetch theme settings", err);
      }
    };
    fetchTheme();
  }, [dispatch]);

  const StatCard = ({ title, value, icon, change, isPositive }) => (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group transition-all"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex justify-between items-start relative z-10">
        <div
          className={`p-4 rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white`}
        >
          {icon}
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-sm font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}
          >
            {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
            {change}%
          </div>
        )}
      </div>

      <div className="mt-6 relative z-10">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          {title}
        </p>
        <h3 className="text-4xl font-black text-gray-900 mt-1">
          {loading ? (
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-lg"></div>
          ) : (
            value
          )}
        </h3>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary-600 cursor-pointer hover:underline relative z-10">
        View Details <FaArrowRight size={10} />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-10 pb-12 overflow-hidden">
      {/* Premium Header */}
      <div className="relative rounded-[2.5rem] bg-gray-200 p-10 text-white overflow-hidden shadow-2xl shadow-gray-200">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl text-black md:text-5xl font-black tracking-tight"
            >
              Welcome back,{" "}
              <span className="text-primary-400">
                {user.name.split(" ")[0]}!
              </span>
            </motion.h1>
            <p className="text-gray-800 text-lg font-medium">
              Here's what's happening with{" "}
              <span className="text-black font-bold">{user.orgName}</span>{" "}
              today.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary-900/30 flex items-center gap-2 active:scale-95">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Bookings"
          value={overview.totalBookings}
          icon={<FaCalendarCheck size={24} />}
          change="12"
          isPositive={true}
        />
        <StatCard
          title="Active Services"
          value={overview.activeServices}
          icon={<FaConciergeBell size={24} />}
        />
        <StatCard
          title="Total Revenue"
          value={`$${overview.revenue?.toLocaleString() || "0"}`}
          icon={<FaDollarSign size={24} />}
          change="8"
          isPositive={true}
        />
      </div>

      {/* Charts Section with Glassmorphism feel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900 italic">
              Booking Trends
            </h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-500"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Growth
              </span>
            </div>
          </div>
          <div className="h-80">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-100 border-t-primary-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview.chartsData || []}>
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
                        stopColor="var(--org-primary)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--org-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                    }}
                    itemStyle={{ fontWeight: 700, color: "var(--org-primary)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="var(--org-primary)"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorBookings)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900 italic">
              Revenue Overview
            </h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                PROFIT
              </span>
            </div>
          </div>
          <div className="h-80">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-100 border-t-green-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview.chartsData || []}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Revenue"]}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                    }}
                    itemStyle={{ fontWeight: 700, color: "#10B981" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Daily Activity Detailed View */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h3 className="text-2xl font-black text-gray-900 italic">
              Daily Activity
            </h3>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">
              Last 30 Days Snapshot
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded-2xl flex gap-2">
            <button className="px-4 py-2 bg-white rounded-xl text-primary-600 font-bold shadow-sm">
              Bookings
            </button>
            <button className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">
              Revenue
            </button>
          </div>
        </div>

        <div className="h-96">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.dailyStats || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc", radius: 10 }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Bookings"
                  fill="var(--org-primary)"
                  radius={[8, 8, 0, 0]}
                  barSize={20}
                  animationDuration={3000}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OrgHome;
