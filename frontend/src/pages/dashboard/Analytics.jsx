import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../operations/dashboard/dashboardAction";
import { motion, AnimatePresence } from "framer-motion";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaChartLine,
  FaCalendarAlt,
  FaDollarSign,
  FaFilter,
  FaSync,
  FaArrowUp,
  FaArrowDown,
  FaShoppingBag,
  FaChartPie,
  FaListOl,
} from "react-icons/fa";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const STATUS_COLORS = {
  completed: "#10b981",
  confirmed: "#6366f1",
  pending: "#f59e0b",
  cancelled: "#ef4444",
  "no-show": "#8b5cf6",
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-4 min-w-[160px]">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {entry.name?.includes("Revenue") ? "₹" : ""}
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Custom Pie Label
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  );
};

export default function Analytics() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getDashboardStats(dateRange));
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    dispatch(getDashboardStats(dateRange));
  };

  const refreshStats = async () => {
    setRefreshing(true);
    await dispatch(getDashboardStats(dateRange));
    setTimeout(() => setRefreshing(false), 600);
  };

  const avgBookingValue =
    stats?.totalBookings > 0
      ? Math.round(stats.revenue / stats.totalBookings)
      : 0;

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `₹${(stats?.revenue || 0).toLocaleString()}`,
      icon: FaDollarSign,
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      subtitle: "In selected period",
    },
    {
      title: "Total Bookings",
      value: (stats?.totalBookings || 0).toLocaleString(),
      icon: FaShoppingBag,
      gradient: "from-indigo-500 to-violet-600",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      subtitle: "Across all services",
    },
    {
      title: "Avg. Booking Value",
      value: `₹${avgBookingValue.toLocaleString()}`,
      icon: FaChartLine,
      gradient: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      subtitle: "Revenue ÷ Bookings",
    },
  ];

  if (loading && !stats)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-gray-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header & Date Controls ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <FaChartLine size={18} />
              </div>
              Analytics
            </h2>
            <p className="text-gray-500 text-sm mt-1 ml-[52px]">
              Deep dive into your business performance
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-100 shadow-sm">
              <FaCalendarAlt className="text-gray-400 text-xs" />
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleFilterChange}
                className="bg-transparent text-sm focus:outline-none text-gray-700 font-medium w-[120px]"
              />
              <span className="text-gray-300 mx-1">→</span>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleFilterChange}
                className="bg-transparent text-sm focus:outline-none text-gray-700 font-medium w-[120px]"
              />
            </div>
            <button
              onClick={applyFilters}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <FaFilter size={11} /> Apply
            </button>
            <button
              onClick={refreshStats}
              className={`p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all ${refreshing ? "animate-spin" : ""}`}
              title="Refresh Data"
            >
              <FaSync size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    {card.title}
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    {card.subtitle}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main Revenue & Bookings Trend Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Revenue & Bookings Trend
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Track your growth over the selected period
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              Bookings
            </span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats?.chartsData || []}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
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
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue (₹)"
                dot={false}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                stroke="#6366F1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorBookings)"
                name="Bookings"
                dot={false}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Bottom Grid: Pie + Bar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <FaChartPie size={16} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Status Distribution
              </h3>
              <p className="text-xs text-gray-400">
                Booking breakdown by status
              </p>
            </div>
          </div>

          {(stats?.statusDistribution || []).length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No data available
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.statusDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={4}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={false}
                    strokeWidth={0}
                  >
                    {(stats?.statusDistribution || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[entry.name?.toLowerCase()] ||
                          COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Status Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-gray-50">
            {(stats?.statusDistribution || []).map((entry, i) => (
              <span
                key={entry.name}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[entry.name?.toLowerCase()] ||
                      COLORS[i % COLORS.length],
                  }}
                />
                {entry.name}:{" "}
                <span className="font-bold text-gray-900">{entry.value}</span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* Top Services by Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <FaListOl size={16} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top Services</h3>
              <p className="text-xs text-gray-400">By revenue performance</p>
            </div>
          </div>

          {(stats?.servicePerformance || []).length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No data available
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats?.servicePerformance?.slice(0, 5) || []}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    fill="url(#barGradient)"
                    radius={[0, 8, 8, 0]}
                    barSize={24}
                    name="Revenue (₹)"
                  />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
