import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaSortNumericDown,
  FaCheck,
  FaBan,
} from "react-icons/fa";

// Configure Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api/platform",
});

export default function Vendors() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    try {
      const res = await api.get("/organizations");
      setOrgs(res.data.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (id, data) => {
    try {
      await api.put(`/organizations/${id}/marketplace`, data);
      setOrgs(orgs.map((o) => (o.id === id ? { ...o, ...data } : o)));
    } catch (err) {
      alert("Failed to update");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Vendor Management
      </h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Organization</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700">
                Marketplace Visible
              </th>
              <th className="p-4 font-semibold text-gray-700">Rank</th>
              <th className="p-4 font-semibold text-gray-700">Tag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    <Link
                      to={`/vendors/${org.id}`}
                      className="hover:text-indigo-600 hover:underline"
                    >
                      {org.name}
                    </Link>
                  </div>
                  <div className="text-sm text-gray-500">{org.slug}</div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      updateSettings(org.id, { isActive: !org.isActive })
                    }
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      org.isActive
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    {org.isActive ? <FaCheck size={12} /> : <FaBan size={12} />}
                    {org.isActive ? "Active" : "Banned"}
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      updateSettings(org.id, {
                        isMarketplaceVisible: !org.isMarketplaceVisible,
                      })
                    }
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      org.isMarketplaceVisible
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {org.isMarketplaceVisible ? <FaEye /> : <FaEyeSlash />}
                    {org.isMarketplaceVisible ? "Visible" : "Hidden"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <FaSortNumericDown className="text-gray-400" />
                    <input
                      type="number"
                      value={org.marketplaceRank}
                      onChange={(e) =>
                        updateSettings(org.id, {
                          marketplaceRank: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-16 border rounded px-2 py-1 text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <select
                    value={org.marketplaceTag}
                    onChange={(e) =>
                      updateSettings(org.id, { marketplaceTag: e.target.value })
                    }
                    className="border rounded px-2 py-1 text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="NONE">None</option>
                    <option value="FEATURED">Featured</option>
                    <option value="NEW">New</option>
                    <option value="POPULAR">Popular</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
