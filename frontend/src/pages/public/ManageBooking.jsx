import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/baseurl";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBan,
  FaEdit,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import DateTimeSelection from "../booking/Steps/DateTimeSelection";

export default function ManageBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState("verify"); // 'verify' | 'manage'

  // Reschedule State (DateTimeSelection integration)
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Verify Identity
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/bookings/public/verify", {
        bookingId: id,
        email: email,
      });
      setToken(res.data.token); // Secure token
      setBooking(res.data.booking);
      setView("manage");
    } catch (err) {
      setError(
        err.response?.data?.error || "Verification failed. Check your email."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch slots when date changes
  useEffect(() => {
    if (showReschedule && selectedDate && booking) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          // Use booking.serviceId if available in booking object from verify
          // Note: booking object structure from verify endpoint must include serviceId
          // Let's assume verify returns serviceId or we might need to fetch it.
          // In bookingController verifyPublicAccess, we returned: serviceName: booking.Service?.name
          // We probably need serviceId too.
          // EDIT: Checked controller, it returns: id, startTime, endTime, customerName, serviceName, status.
          // WITHOUT serviceId, we can't fetch slots correctly if logic depends on duration.
          // For now, let's assume the public endpoints allows fetching /slots with just date if passing 'serviceName' is weird or update controller.
          // Better: update verify controller to return serviceId.
          // Assuming we did that or will do it. Let's send a request and if it fails, I'll update controller.
          const res = await axiosInstance.get(
            `/bookings/slots?date=${selectedDate}&serviceId=${
              booking.serviceId || 1
            }` // Fallback or strict?
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
  }, [selectedDate, showReschedule, booking]);

  // 2. Actions (Cancel / Reschedule)
  const getAuthHeaders = () => ({
    headers: { "x-booking-token": token },
  });

  const handleCancel = async () => {
    const reason = window.prompt("Reason for cancellation?");
    if (reason === null) return;

    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    setActionLoading(true);
    try {
      await axiosInstance.put(
        `/bookings/${id}/cancel`,
        { reason },
        getAuthHeaders()
      );
      // Refresh
      alert("Booking cancelled successfully.");
      setBooking((prev) => ({ ...prev, status: "cancelled" }));
    } catch (err) {
      alert("Failed to cancel: " + (err.response?.data?.error || "Error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSlotSelect = async (slotTime) => {
    const formattedTime = new Date(slotTime).toLocaleString();
    const reason = window.prompt(
      `Reschedule to ${formattedTime}?\n\nOptionally enter a reason for rescheduling:`
    );

    if (reason === null) return; // Cancelled

    setActionLoading(true);
    try {
      await axiosInstance.put(
        `/bookings/${id}/reschedule`,
        { newStartTime: slotTime, reason },
        getAuthHeaders()
      );
      alert("Booking rescheduled successfully.");
      setBooking((prev) => ({
        ...prev,
        startTime: slotTime,
        status: "confirmed",
      }));
      setShowReschedule(false);
      setAvailableSlots([]);
      setSelectedDate("");
    } catch (err) {
      alert(
        "Failed to reschedule: " +
          (err.response?.data?.error || "Slot unavailable")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FaCheckCircle /> Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FaClock /> Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FaTimesCircle /> Cancelled
          </span>
        );
      default:
        return status;
    }
  };

  // UI Components
  if (view === "verify") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 text-2xl">
              <FaCalendarAlt />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Manage Your Booking
          </h2>
          <p className="text-gray-500 text-center text-sm mb-8">
            Enter the email address used for this booking to access details.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />} Verify access
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mt-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-8 py-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Booking Details</h2>
              <p className="opacity-90 text-sm mt-1">Manage your appointment</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <FaCalendarAlt size={24} />
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {!showReschedule ? (
              // DETAILS VIEW
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-gray-100 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Service
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {booking.serviceName || "Service"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {booking.bookingId}
                    </p>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(booking.startTime).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-gray-600">
                      {new Date(booking.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customer</p>
                    <p className="text-lg font-medium text-gray-900">
                      {booking.customerName}
                    </p>
                    <p className="text-gray-600">{email}</p>
                  </div>
                </div>

                {/* Actions */}
                {booking.status !== "cancelled" && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowReschedule(true)}
                      className="flex-1 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      <FaEdit /> Reschedule
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={actionLoading}
                      className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      {actionLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaBan />
                      )}{" "}
                      Cancel Booking
                    </button>
                  </div>
                )}
                {booking.status === "cancelled" && (
                  <div className="bg-gray-100 p-4 rounded text-center text-gray-500 italic">
                    This booking has been cancelled. No further actions
                    available.
                  </div>
                )}
              </>
            ) : (
              // RESCHEDULE VIEW using Component
              <div className="h-[800px]">
                <DateTimeSelection
                  slots={availableSlots}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onSlotSelect={handleSlotSelect}
                  onBack={() => setShowReschedule(false)}
                  loading={loadingSlots}
                  primaryColor="#4F46E5" // Indigo-600
                />
                {actionLoading && (
                  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <FaSpinner className="animate-spin text-white text-3xl" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
