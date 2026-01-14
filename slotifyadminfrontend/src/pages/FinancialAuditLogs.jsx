import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileInvoiceDollar, FaSearch, FaHistory } from "react-icons/fa";

export default function FinancialAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");

  useEffect(() => {
    fetchOrgs();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [page, selectedOrg]);

  const fetchOrgs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/platform/organizations",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("platform_token")}`,
          },
        }
      );
      setOrgs(res.data);
    } catch (err) {
      console.error("Failed to fetch orgs", err);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 20,
        ...(selectedOrg && { orgId: selectedOrg }),
      });

      const res = await axios.get(
        `http://localhost:5000/api/platform/audit-logs?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("platform_token")}`,
          },
        }
      );
      setLogs(res.data.logs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaHistory className="text-gray-500" /> Financial Audit Logs
        </h1>

        <div className="flex items-center gap-2">
          <select
            value={selectedOrg}
            onChange={(e) => {
              setSelectedOrg(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Organizations</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading audit trail...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Organization</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Entity Type</th>
                  <th className="px-6 py-3">Admin</th>
                  <th className="px-6 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 font-medium text-indigo-600">
                        {log.Organization?.name || "N/A"}
                      </td>
                      <td className="px-6 py-3 font-semibold text-gray-800">
                        {log.action}
                      </td>
                      <td className="px-6 py-3">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {log.entityType}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {log.performedByEmail || "System"}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-gray-500">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No audit logs found.
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
