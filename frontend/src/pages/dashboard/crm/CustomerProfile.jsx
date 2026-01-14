import { useState, useEffect } from "react"; // Removed React import
import { motion } from "framer-motion";
import {
  FaTimes,
  FaSave,
  FaHistory,
  FaTag,
  FaStickyNote,
} from "react-icons/fa";

export default function CustomerProfile({ customer, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email || "",
    mobile: customer.mobile || "",
    notes: customer.notes || "",
    tags: customer.tags ? customer.tags.join(", ") : "",
  });

  // Calculate local stats from history if needed, or use passed
  // The customer object passed might be from list (no history yet)
  // We'd ideally fetch full details including history here if not present.
  // But for speed, let's assume we can fetch or display what we have.
  // Actually, listCustomers doesn't return history. We need to fetch details.
  // But to keep it simple component-wise:
  // I'll add a fetch capability inside this modal or assume parent handles it.
  // Let's fetch details here if history is missing.

  const [details, setDetails] = useState(customer);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // We need to import axiosInstance to fetch specific details if not provided
  // Or simpler: dispatch fetchCustomerDetails and use selector?
  // Let's just use axios for this specific read to avoid redux complexity collision with list
  // Actually, redux is better. But I'll use a local fetch for "lite" history loading.

  useEffect(() => {
    // If history missing, fetch it
    if (!customer.bookings) {
      setLoadingHistory(true);
      // Direct fetch or action? Let's use the fetchCustomerDetails action pattern
      // but here I don't want to replace the *list* in redux.
      // So I'll do a quick fetch.
      // Assuming axiosInstance is available via import
      import("../../../utils/baseurl").then(({ axiosInstance }) => {
        axiosInstance
          .get(`/customers/${customer.id}`)
          .then((res) => {
            setDetails(res.data);
            setFormData((prev) => ({
              ...prev,
              notes: res.data.notes || "",
              tags: res.data.tags ? res.data.tags.join(", ") : "",
            }));
            setLoadingHistory(false);
          })
          .catch((err) => setLoadingHistory(false));
      });
    }
  }, [customer.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Parse tags
    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    onUpdate({
      ...formData,
      tags: tagsArray,
    });
    // Close handled by parent if success, or keep open? Keep open to show success?
    // Parent logic closes it? No, parent just updates list.
    // Let's show a "Saved" feedback maybe?
    // efficient: onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
      >
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-100">
          <div className="flex justify-between items-start md:hidden mb-4">
            <h3 className="font-bold">Profile</h3>
            <button onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl mb-3">
              {details.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{details.name}</h2>
            <p className="text-sm text-gray-500">
              Customer since {new Date(details.createdAt).getFullYear()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full text-sm bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Mobile
              </label>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full text-sm bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                <FaTag size={10} /> Tags{" "}
                <span className="text-[10px] font-normal normal-case opacity-50">
                  (comma separated)
                </span>
              </label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="VIP, Frequent, Late..."
                className="w-full text-sm bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                <FaStickyNote size={10} /> Private Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full text-sm bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-indigo-500 outline-none resize-none"
                placeholder="Internal notes about this customer..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FaSave /> Save Changes
            </button>
          </form>
        </div>

        {/* Main Content: History */}
        <div className="w-full md:w-2/3 p-6">
          <div className="hidden md:flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaHistory className="text-gray-400" /> Booking History
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center p-12 text-gray-400">
              Loading history...
            </div>
          ) : details.bookings && details.bookings.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {details.bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {new Date(booking.startTime).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(booking.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {booking.Service?.name || "Unknown Service"}
                        <div className="text-xs text-gray-400">
                          {booking.Service?.price || "$ -"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No booking history available.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
