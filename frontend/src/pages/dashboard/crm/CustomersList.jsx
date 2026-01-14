import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTag,
  FaHistory,
} from "react-icons/fa";
import {
  fetchCustomers,
  updateCustomer,
} from "../../../operations/customer/customerAction";
import CustomerProfile from "./CustomerProfile";

export default function CustomersList() {
  const dispatch = useDispatch();
  const { customers, total, page, totalPages, loading } = useSelector(
    (state) => state.customer
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // Debounce search could be added here
    dispatch(fetchCustomers(1, searchTerm));
  }, [dispatch, searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchCustomers(newPage, searchTerm));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          Customers{" "}
          <span className="text-gray-400 text-sm font-normal">({total})</span>
        </h2>
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            Loading...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Tags</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Bookings
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((customer) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {customer.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaEnvelope size={12} className="text-gray-400" />
                            {customer.email}
                          </div>
                        )}
                        {customer.mobile && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaPhone size={12} className="text-gray-400" />
                            {customer.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags && customer.tags.length > 0 ? (
                          customer.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-300 text-xs italic">
                            No tags
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex flex-col items-center">
                        <span className="text-lg font-bold text-gray-700">
                          {customer.totalBookings}
                        </span>
                        {customer.lastBookingDate && (
                          <span className="text-[10px] text-gray-400">
                            Last:{" "}
                            {new Date(
                              customer.lastBookingDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-1 rounded hover:bg-indigo-50 transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedCustomer && (
        <CustomerProfile
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={(updatedData) => {
            // Optimistic local update or re-fetch?
            // Let's re-fetch details or dispatch update
            // For now just re-fetch list is simpler for "lite"
            dispatch(updateCustomer(selectedCustomer.id, updatedData));
            setSelectedCustomer({ ...selectedCustomer, ...updatedData }); // Local update
          }}
        />
      )}
    </div>
  );
}
