import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../operations/dashboard/dashboardAction";
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
} from "react-icons/fa";

export default function Analytics() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  // Default to last 30 days
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    dispatch(getDashboardStats(dateRange));
  }, [dispatch]); // Initial load

  const handleFilterChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    dispatch(getDashboardStats(dateRange));
  };

  const refreshStats = () => {
    dispatch(getDashboardStats(dateRange));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  if (loading && !stats)
    return (
      <div className="p-8 text-center text-gray-500">Loading analytics...</div>
    );

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaChartLine className="text-indigo-600" /> Advanced Analytics
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Deep dive into your business performance
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 px-2">
            <FaCalendarAlt className="text-gray-400" />
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleFilterChange}
              className="bg-transparent text-sm focus:outline-none text-gray-700 font-medium"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleFilterChange}
              className="bg-transparent text-sm focus:outline-none text-gray-700 font-medium"
            />
          </div>
          <button
            onClick={applyFilters}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <FaFilter size={12} /> Apply
          </button>
          <button
            onClick={refreshStats}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-md transition-all"
            title="Refresh Data"
          >
            <FaSync size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover-effect">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
            Total Revenue
          </h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900 flex items-center">
              <FaDollarSign className="text-2xl text-gray-400 mb-1" />
              {stats?.revenue?.toLocaleString() || 0}
            </span>
          </div>
          <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 inline-block px-2 py-0.5 rounded-full">
            Based on date range
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover-effect">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
            Total Bookings
          </h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {stats?.totalBookings?.toLocaleString() || 0}
            </span>
          </div>
          <p className="text-xs text-indigo-600 mt-2 font-medium bg-indigo-50 inline-block px-2 py-0.5 rounded-full">
            Across all services
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover-effect">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
            Avg. Booking Value
          </h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900 flex items-center">
              <FaDollarSign className="text-2xl text-gray-400 mb-1" />
              {stats?.totalBookings > 0
                ? Math.round(
                    stats.revenue / stats.totalBookings
                  ).toLocaleString()
                : 0}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Revenue / Bookings</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Timeline Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Revenue & Bookings Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats?.chartsData || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorBookings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
                <YAxis yAxisId="right" orientation="right" stroke="#4F46E5" />
                <Tooltip />
                <Legend />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.3}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue ($)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#4F46E5"
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  name="Bookings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Booking Status Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.statusDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.statusDistribution || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Top Services by Revenue
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stats?.servicePerformance?.slice(0, 5) || []} // Top 5
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar
                  dataKey="revenue"
                  fill="#4F46E5"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
