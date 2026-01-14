import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFilter,
  FaSync,
  FaBan,
  FaEdit,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaUserSlash,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { getBookings } from "../../operations/booking/bookingAction";
import HorizontalDateScroller from "./components/HorizontalDate";
import { axiosInstance } from "../../utils/baseurl";
import DateTimeSelection from "../booking/Steps/DateTimeSelection";
import BookingHorizontalDateScroller from "./components/BookingHorizontalDate";

// Rescale Modal Component (Widened for Calendar)
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function BookingsList() {
  const dispatch = useDispatch();
  const { bookings, loading, error, totalPages, page, total } = useSelector(
    (state) => state.booking
  );

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [rescheduleData, setRescheduleData] = useState(null); // { id: 1, currentStart: ... }
  const [actionLoading, setActionLoading] = useState(false);

  // DateTimeSelection integration state
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    dispatch(getBookings({ ...filters, page: currentPage }));
  }, [dispatch, currentPage]); // Re-fetch when page changes. Filters trigger explicit apply.

  // Fetch slots when date changes in Reschedule Modal
  useEffect(() => {
    if (rescheduleData && selectedRescheduleDate) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          // We need serviceId. The booking object should have it?
          // The bookings list response (bookingController.listBookings) includes { model: Service, attributes: ["name"] }.
          // It implies it MIGHT NOT have serviceId unless it's on the main booking object or added to attributes.
          // Booking model has serviceId FK. So booking.serviceId should be there.
          const res = await axiosInstance.get(
            `/bookings/slots?date=${selectedRescheduleDate}&serviceId=${
              rescheduleData.serviceId || 1
            }`
          );
          setAvailableSlots(res.data.slots);
        } catch (error) {
          console.error("Failed to fetch slots", error);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedRescheduleDate, rescheduleData]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    dispatch(getBookings({ ...filters, page: 1 }));
  };

  const handleRefresh = () => {
    setFilters({ startDate: "", endDate: "", status: "" });
    setCurrentPage(1);
    dispatch(getBookings({ page: 1 }));
  };

  const handleDateSelect = (dateString) => {
    setFilters((prev) => ({
      ...prev,
      startDate: dateString,
      endDate: dateString,
    }));
    setCurrentPage(1);
    dispatch(
      getBookings({
        ...filters,
        startDate: dateString,
        endDate: dateString,
        page: 1,
      })
    );
  };

  const onCancelBooking = async (id) => {
    const reason = window.prompt("Reason for cancellation?");
    if (reason === null) return; // Cancelled prompt

    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    setActionLoading(true);
    try {
      await axiosInstance.put(`/bookings/${id}/cancel`, { reason });
      dispatch(getBookings(filters));
    } catch (error) {
      alert(
        "Failed to cancel: " + (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const onMarkNoShow = async (id) => {
    if (!window.confirm("Mark this booking as 'No Show'?")) return;

    setActionLoading(true);
    try {
      await axiosInstance.put(`/bookings/${id}/noshow`);
      dispatch(getBookings(filters));
    } catch (error) {
      alert(
        "Failed to mark No Show: " +
          (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadInvoice = async (bookingId) => {
    try {
      const response = await axiosInstance.get(
        `/bookings/${bookingId}/invoice`,
        {
          responseType: "blob",
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${bookingId.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download invoice.");
    }
  };

  const onRescheduleClick = (booking) => {
    setRescheduleData(booking);
    // Reset selection state
    setSelectedRescheduleDate("");
    setAvailableSlots([]);
  };

  const handleSlotSelect = async (slotTime) => {
    if (
      !window.confirm(`Reschedule to ${new Date(slotTime).toLocaleString()}?`)
    )
      return;

    setActionLoading(true);
    try {
      await axiosInstance.put(`/bookings/${rescheduleData.id}/reschedule`, {
        newStartTime: slotTime,
      });
      setRescheduleData(null);
      dispatch(getBookings(filters));
      alert("Booking rescheduled successfully");
    } catch (error) {
      alert(
        "Failed to reschedule: " +
          (error.response?.data?.error || "Slot unavailable or error")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const onMarkCompleted = async (id) => {
    if (!window.confirm("Confirm job completion? Ensure payment is settled."))
      return;

    setActionLoading(true);
    try {
      await axiosInstance.put(`/bookings/${id}/complete`); // Requires backend route
      dispatch(getBookings(filters));
    } catch (error) {
      alert(
        "Failed to complete: " + (error.response?.data?.error || "Unknown")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <FaCheckCircle /> Confirmed
          </span>
        );
      case "awaiting_completion":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 animate-pulse">
            <FaClock /> Awaiting Completion
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
            <FaCheckCircle /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <FaClock /> Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <FaTimesCircle /> Cancelled
          </span>
        );
      case "no_show":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 border border-gray-300">
            <FaUserSlash /> No Show
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-gray bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  if (loading && bookings.length === 0)
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  if (error)
    return <div className="text-red-500 p-6 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
            <FaCalendarAlt />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Booking History</h2>
        </div>
      </div>

      {/* Date Scroller */}
      <div className="bg-white border-b border-gray-100">
        <BookingHorizontalDateScroller onDateSelect={handleDateSelect} />
      </div>

      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="text-sm text-gray-500">
          Showing bookings for {filters.startDate || "all time"}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={applyFilters}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
          >
            <FaFilter size={12} /> Filter
          </button>
          <button
            onClick={handleRefresh}
            className="text-gray-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-gray-100 transition"
            title="Refresh"
          >
            <FaSync size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-white divide-y divide-gray-50"
          >
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-500 italic"
                >
                  No bookings found matching criteria.
                </td>
              </tr>
            )}
            {bookings.map((booking) => (
              <motion.tr
                key={booking.id}
                variants={item}
                className="hover:bg-indigo-50/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                  {booking.bookingId || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                      {booking.customerName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.customerEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {booking.Service?.name}
                  </span>
                  {booking.rescheduleReason && (
                    <div className="mt-1 text-xs text-indigo-600">
                      <span className="font-semibold">Rescheduled:</span>{" "}
                      {booking.rescheduleReason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(booking.startTime).toLocaleDateString()}{" "}
                  <span className="text-gray-400">at</span>{" "}
                  {new Date(booking.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                  {booking.status === "cancelled" &&
                    booking.cancellationReason && (
                      <div
                        className="mt-1 text-xs text-red-500 max-w-[150px] truncate"
                        title={booking.cancellationReason}
                      >
                        Reason: {booking.cancellationReason}
                      </div>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end items-center gap-3">
                    {/* PRIMARY ACTION */}
                    {(booking.status === "awaiting_completion" ||
                      booking.status === "confirmed") && (
                      <button
                        onClick={() => onMarkCompleted(booking.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium
                   hover:bg-green-700 transition shadow"
                      >
                        Mark Completed
                      </button>
                    )}

                    {/* SECONDARY ACTIONS */}
                    {booking.status !== "cancelled" && (
                      <div className="flex items-center gap-2">
                        <IconButton
                          onClick={() => onRescheduleClick(booking)}
                          title="Reschedule"
                          className="text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
                        >
                          <FaEdit />
                        </IconButton>

                        <IconButton
                          onClick={() => onCancelBooking(booking.id)}
                          title="Cancel"
                          className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                        >
                          <FaBan />
                        </IconButton>

                        <IconButton
                          onClick={() => onMarkNoShow(booking.id)}
                          title="Mark No Show"
                          className="text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100"
                        >
                          <FaUserSlash />
                        </IconButton>
                      </div>
                    )}

                    {/* UTILITIES */}
                    <IconButton
                      onClick={() => setHistoryData(booking)}
                      title="View History"
                      className="text-gray-400 border-gray-200 bg-gray-50 hover:bg-gray-100"
                    >
                      <FaClock />
                    </IconButton>

                    {(booking.status === "confirmed" ||
                      booking.status === "completed") && (
                      <IconButton
                        onClick={() => handleDownloadInvoice(booking.id)}
                        title="Download Invoice"
                        className="text-indigo-500 border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
                      >
                        <FaFileInvoiceDollar />
                      </IconButton>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="text-sm text-gray-500">
          Showing page <span className="font-bold">{page}</span> of{" "}
          <span className="font-bold">{totalPages}</span> ({total} total)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={page >= totalPages}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!rescheduleData}
        onClose={() => setRescheduleData(null)}
        title="Reschedule Booking"
      >
        <div className="h-[550px]">
          {actionLoading ? (
            <div className="h-full flex items-center justify-center">
              <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
          ) : (
            <DateTimeSelection
              slots={availableSlots}
              selectedDate={selectedRescheduleDate}
              onDateChange={setSelectedRescheduleDate}
              onSlotSelect={handleSlotSelect}
              onBack={() => setRescheduleData(null)} // Or just close
              loading={loadingSlots}
              primaryColor="#4F46E5"
            />
          )}
        </div>
      </Modal>

      {/* History Modal */}
      <HistoryModal
        isOpen={!!historyData}
        onClose={() => setHistoryData(null)}
        bookingId={historyData?.id}
      />
    </div>
  );
}

const IconButton = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`p-2 rounded border transition
                hover:shadow-sm ${className}`}
  >
    {children}
  </button>
);

// History Modal Component
const HistoryModal = ({ isOpen, onClose, bookingId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && bookingId) {
      setLoading(true);
      axiosInstance
        .get(`/bookings/${bookingId}/logs`)
        .then((res) => setLogs(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Booking History</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No history found.</p>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1.5 ring-4 ring-indigo-50"></div>
                  <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                </div>
                <div className="pb-6">
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                  <h4 className="font-semibold text-gray-900">{log.action}</h4>
                  <div className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded border border-gray-100 font-mono text-xs">
                    {log.changes ? (
                      <pre className="whitespace-pre-wrap font-sans">
                        {Object.entries(log.changes || {}).map(
                          ([key, value]) => (
                            <div key={key}>
                              <span className="font-semibold text-gray-700">
                                {key}:
                              </span>{" "}
                              {String(value)}
                            </div>
                          )
                        )}
                      </pre>
                    ) : (
                      "No details recorded"
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    IP: {log.ipAddress || "Unknown"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
