import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaTags,
  FaMoneyBillWave,
  FaChartBar,
  FaMousePointer,
  FaExternalLinkAlt,
  FaFilePdf,
} from "react-icons/fa";

const api = axios.create({
  baseURL: "http://localhost:5000/api/platform",
});

export default function OrgDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ledger State
  const [activeTab, setActiveTab] = useState("overview");
  const [ledgerData, setLedgerData] = useState({
    transactions: [],
    stats: {},
    totalPages: 1,
  });
  const [ledgerPage, setLedgerPage] = useState(1);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [id]);

  useEffect(() => {
    if (activeTab === "ledger") {
      fetchLedger(ledgerPage);
    }
  }, [activeTab, ledgerPage, id]);

  const fetchLedger = async (pageNum = 1) => {
    setLedgerLoading(true);
    try {
      // Direct call to Payment Service or Platform Proxy
      // Note: Admin frontend usually talks to /api/platform.
      // We might need to call the payment route directly as it's not under /api/platform prefix typically?
      // Assuming backend exposes /api/payment/ledger globally (which it does).
      // We need to use full URL if 'api' instance is scoped to /api/platform.
      // Let's assume standard axios or adjusting the path.
      // We will use a direct axios call with the token.
      const res = await axios.get(
        `http://localhost:5000/api/payment/ledger?orgId=${id}&page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("platform_token")}`,
          },
        }
      );
      setLedgerData(res.data);
    } catch (err) {
      console.error("Failed to fetch ledger", err);
    } finally {
      setLedgerLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const markAsPaid = async (ledgerId) => {
    if (!window.confirm("Are you sure you want to mark this as PAID?")) return;

    try {
      await axios.post(
        `http://localhost:5000/api/payment/payout/${ledgerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("platform_token")}`,
          },
        }
      );
      // Refresh ledger
      fetchLedger(ledgerPage);
      fetchStats(); // Update stats too
    } catch (err) {
      console.error("Payout Error:", err);
      alert("Failed to update payout status");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get(`/organizations/${id}/stats`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const token = localStorage.getItem("platform_token");
    const link = document.createElement("a");
    link.href = `http://localhost:5000/api/payment/export/csv?orgId=${id}&token=${token}`; // Pass token via query or handle auth differently for file download.
    // Best practice: Fetch blob with axios and download.
    // For simplicity:
    window.open(
      `http://localhost:5000/api/payment/export/csv?orgId=${id}&token=${token}`,
      "_blank"
    );
  };

  const handleExportBlob = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/payment/export/csv?orgId=${id}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("platform_token")}`,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ledger_export.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed", error);
      alert("Export failed");
    }
  };

  const sendReminder = async (ledgerId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/payment/remind/${ledgerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("platform_token")}`,
          },
        }
      );
      alert("Reminder sent to vendor!");
    } catch (err) {
      console.error("Reminder Error:", err);
      alert("Failed to send reminder");
    }
  };

  const handleSendTotalReminder = async () => {
    if (
      !window.confirm(
        "Send a total settlement reminder email for all outstanding dues?"
      )
    )
      return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/payment/remind-total/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("platform_token")}`,
          },
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Total Reminder Error:", err);
      alert(err.response?.data?.error || "Failed to send total reminder");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Org not found</div>;

  const { organization, totalBookings, activeServices, revenue, marketplace } =
    data;

  return (
    <div>
      <Link
        to="/vendors"
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <FaArrowLeft /> Back to Vendors
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center gap-6">
          {organization.logoUrl && (
            <img
              src={organization.logoUrl}
              alt="Logo"
              className="w-20 h-20 rounded-lg object-cover bg-gray-50 border"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {organization.name}
            </h1>
            <p className="text-gray-500">{organization.slug}</p>
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                organization.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {organization.isActive ? "Active" : "Inactive"}
            </div>
            {organization.isMarketplaceVisible && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Marketplace Visible
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("ledger")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "ledger"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Financial Ledger
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              label="Total Bookings"
              value={totalBookings}
              icon={<FaCalendarCheck className="text-indigo-500" />}
            />
            <StatCard
              label="Active Services"
              value={activeServices}
              icon={<FaTags className="text-pink-500" />}
            />
            <StatCard
              label="Total Revenue (Est)"
              value={`$${revenue}`}
              icon={<FaMoneyBillWave className="text-green-500" />}
            />
          </div>

          {/* Marketplace Performance */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Marketplace Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                label="Total Views (Quick View)"
                value={marketplace?.totalViews || 0}
                icon={<FaChartBar className="text-blue-500" />}
              />
              <StatCard
                label="Total Clicks (Modal)"
                value={marketplace?.totalClicks || 0}
                icon={<FaMousePointer className="text-purple-500" />}
              />
              <StatCard
                label="Total Redirects (Leads)"
                value={marketplace?.totalRedirects || 0}
                icon={<FaExternalLinkAlt className="text-orange-500" />}
              />
            </div>

            {marketplace?.dailyStats?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-700">
                        Views
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-700">
                        Clicks
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-700">
                        Redirects
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {marketplace.dailyStats.map((stat) => (
                      <tr key={stat.id} className="hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-900">
                          {stat.date}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {stat.views}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {stat.clicks}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {stat.redirects}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Details
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Contact Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {organization.contactEmail || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Platform Plan
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {organization.plan}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Created At
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(organization.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              Vendor Transaction History
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const token = localStorage.getItem("platform_token");
                  window.open(
                    `http://localhost:5000/api/payment/export/pdf/${id}?token=${token}`,
                    "_blank"
                  );
                }}
                className="flex items-center gap-2 text-sm bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded hover:bg-indigo-100 text-indigo-700 mr-2"
              >
                <FaFilePdf className="text-xs" /> Export PDF
              </button>
              <button
                onClick={handleExportBlob}
                className="flex items-center gap-2 text-sm bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 text-gray-700"
              >
                <FaExternalLinkAlt className="text-xs" /> Export CSV
              </button>
            </div>
          </div>
          {/* Ledger Stats Row */}
          <div className="px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex justify-between gap-4 text-sm">
              <div className="flex gap-2">
                <div>
                  <span className="text-gray-500">
                    Total Platform Revenue:{" "}
                  </span>
                  <span className="font-bold text-gray-900">
                    {ledgerData.stats?.totalCommission
                      ? formatCurrency(ledgerData.stats.totalCommission)
                      : "0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Pending Vendor Payout: </span>
                  <span className="font-bold text-green-600">
                    {ledgerData.stats?.pendingPayout
                      ? formatCurrency(ledgerData.stats.pendingPayout)
                      : "0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">
                    Pending Vendor Collections:{" "}
                  </span>
                  <span className="font-bold text-red-600">
                    {ledgerData.stats?.pendingCollection
                      ? formatCurrency(ledgerData.stats.pendingCollection)
                      : "0"}
                  </span>
                </div>
              </div>
              <div>
                {parseFloat(ledgerData.stats?.pendingCollection) > 0 && (
                  <button
                    onClick={handleSendTotalReminder}
                    className="ml-3 text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    Send Reminder
                  </button>
                )}
              </div>
            </div>
          </div>

          {ledgerLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading financial records...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 font-medium">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Mode</th>
                      <th className="px-6 py-3">Gross Booking Value</th>
                      <th className="px-6 py-3">Platform Commission</th>
                      <th className="px-6 py-3 text-right">
                        Settlement Amount
                      </th>
                      <th className="px-6 py-3 text-center">
                        Settlement Direction
                      </th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ledgerData.transactions &&
                    ledgerData.transactions.length > 0 ? (
                      ledgerData.transactions.map((txn) => (
                        <tr
                          key={txn.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-3 whitespace-nowrap">
                            {new Date(txn.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                txn.paymentMode === "PAY_AT_VENUE"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {txn.paymentMode === "PAY_AT_VENUE"
                                ? "VENUE"
                                : "ONLINE"}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            {formatCurrency(txn.grossAmount)}
                          </td>
                          <td className="px-6 py-3 text-gray-500">
                            {formatCurrency(txn.platformCommission)}
                          </td>
                          <td className="px-6 py-3 text-right font-bold text-gray-900">
                            {formatCurrency(txn.netAmount)}
                          </td>
                          <td className="px-6 py-3 text-center text-xs font-medium text-gray-500">
                            {txn.settlementDirection === "PLATFORM_PAYS_VENDOR"
                              ? "Platform → Vendor"
                              : "Vendor → Platform"}
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                txn.status === "SETTLED"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right flex justify-end gap-2">
                            {(txn.status === "UNSETTLED" ||
                              txn.status === "UNPAID") && (
                              <>
                                <button
                                  onClick={() => markAsPaid(txn.id)}
                                  className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 border border-indigo-200"
                                >
                                  Mark as Paid
                                </button>
                                {txn.settlementDirection ===
                                  "VENDOR_PAYS_PLATFORM" && (
                                  <button
                                    onClick={() => sendReminder(txn.id)}
                                    className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 border border-red-200"
                                  >
                                    Remind
                                  </button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          No transactions found for this vendor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <button
                  disabled={ledgerPage === 1}
                  onClick={() => setLedgerPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {ledgerPage} of {ledgerData.totalPages || 1}
                </span>
                <button
                  disabled={ledgerPage >= (ledgerData.totalPages || 1)}
                  onClick={() => setLedgerPage((p) => p + 1)}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-lg text-xl">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
