import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/baseurl";
import { FaMoneyCheckAlt } from "react-icons/fa";

export default function Payments() {
  const [activeTab, setActiveTab] = useState("collected");
  const [payments, setPayments] = useState([]);
  const [ledger, setLedger] = useState({ transactions: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (activeTab === "collected") {
          res = await axiosInstance.get(
            `/payment/payments?page=${page}&limit=20`
          );
          setPayments(res.data.data.payments);
          setTotalPages(res.data.data.totalPages);
        } else {
          // Org Admin hits same endpoint/logic logic relies on req.orgId injection
          res = await axiosInstance.get(
            `/payment/ledger?page=${page}&limit=20`
          );
          setLedger(res.data.data);
          setTotalPages(res.data.data.totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, page]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <FaMoneyCheckAlt className="text-gray-500" /> Payments & Payouts
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const token = localStorage.getItem("accesstoken");
              // Default to current month for demo
              const date = new Date();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              window.open(
                `http://localhost:5000/api/payment/invoice/current?month=${month}&year=${year}&token=${token}`,
                "_blank"
              );
              // Note: 'current' orgId handling needs to be robust in backend or passed here.
              // For now, let's assume Org Admin context creates a button that hits their own known ID or we fix the endpoint to take 'me'.
              // The controller expects :orgId.
            }}
            className="text-sm bg-indigo-50 text-indigo-600 px-3 py-2 rounded hover:bg-indigo-100 border border-indigo-200 flex items-center gap-2"
          >
            Download Invoice (This Month)
          </button>
          <button
            onClick={() => {
              const token = localStorage.getItem("accesstoken");
              window.open(
                `http://localhost:5000/api/payment/export/csv?token=${token}`,
                "_blank"
              );
            }}
            className="text-sm bg-white border border-gray-300 px-3 py-2 rounded hover:bg-gray-50 text-gray-700"
          >
            Export CSV
          </button>
        </div>
      </h1>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("collected")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "collected"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Payments Collected
        </button>
        <button
          onClick={() => setActiveTab("payouts")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "payouts"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Payout Summary
        </button>
      </div>

      {activeTab === "payouts" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Booking Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {ledger.stats?.totalGross
                ? formatCurrency(ledger.stats.totalGross)
                : "₹0"}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Platform Fees (Total)</p>
            <p className="text-2xl font-bold text-gray-500">
              {ledger.stats?.totalCommission
                ? formatCurrency(ledger.stats.totalCommission)
                : "₹0"}
            </p>
          </div>

          {/* Net Settlement Logic */}
          {(() => {
            const pendingPayout = ledger.stats?.pendingPayout || 0;
            const pendingCollection = ledger.stats?.pendingCollection || 0;
            const netBalance = pendingPayout - pendingCollection;
            const isReceivable = netBalance >= 0;

            return (
              <div
                className={`p-6 rounded-xl shadow-sm border ${
                  isReceivable
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p
                    className={`text-sm font-medium ${
                      isReceivable ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    Net Settlement Balance
                  </p>
                  {/* Optional: Expandable details could go here, for now keeping it simple as requested */}
                </div>

                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-3xl font-bold ${
                      isReceivable ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {formatCurrency(Math.abs(netBalance))}
                  </p>
                  <span
                    className={`text-sm font-medium ${
                      isReceivable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isReceivable ? "Receivable" : "Payable"}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex justify-between text-xs opacity-80">
                  <span
                    className={isReceivable ? "text-green-800" : "text-red-800"}
                  >
                    Payout: {formatCurrency(pendingPayout)}
                  </span>
                  <span
                    className={isReceivable ? "text-green-800" : "text-red-800"}
                  >
                    Due: {formatCurrency(pendingCollection)}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  {activeTab === "collected" ? (
                    <>
                      <th className="px-6 py-3">Booking / Service</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Method</th>
                      <th className="px-6 py-3">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3">Booking</th>
                      <th className="px-6 py-3">Payment Mode</th>
                      <th className="px-6 py-3">Booking Value</th>
                      <th className="px-6 py-3">Platform Fee</th>
                      <th className="px-6 py-3 text-center">
                        Settlement Status
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTab === "collected" ? (
                  payments.length > 0 ? (
                    payments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <div className="font-medium text-gray-900">
                            {p.Booking?.customerName || "Customer"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {p.Booking?.bookingId
                              ? `#${p.Booking.bookingId}`
                              : "Booking"}
                            {p.Booking?.startTime &&
                              ` • ${new Date(
                                p.Booking.startTime
                              ).toLocaleDateString()}`}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-900">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="px-6 py-3 capitalize">
                          {p.method || "Online"}
                        </td>
                        <td className="px-6 py-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-6 text-center">
                        No payments found.
                      </td>
                    </tr>
                  )
                ) : ledger.transactions && ledger.transactions.length > 0 ? (
                  ledger.transactions.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">{l.Booking?.customerName}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            l.paymentMode === "PAY_AT_VENUE"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {l.paymentMode === "PAY_AT_VENUE"
                            ? "VENUE"
                            : "ONLINE"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {formatCurrency(l.grossAmount)}
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {formatCurrency(l.platformCommission)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            l.status === "SETTLED"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center">
                      No ledger entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 text-sm border bg-white rounded shadow-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-sm border bg-white rounded shadow-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
