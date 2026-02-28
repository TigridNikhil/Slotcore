import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-hot-toast";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTag,
} from "react-icons/fa";
import { axiosInstance } from "../../utils/baseurl";

const ScanBooking = () => {
  const [scanResult, setScanResult] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false); // Track if we are currently processing a scan

  useEffect(() => {
    // Check if scanner already exists (Strict Mode fix)
    if (scannerRef.current) return;

    // Initialize scanner
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );

    scannerRef.current = html5QrcodeScanner;

    const onScanSuccess = (decodedText, decodedResult) => {
      // Prevent multiple fetches while one is processing
      if (isScanningRef.current) return;

      // If same code, don't refetch essentially, but we need to check strict equivalence carefully
      // We'll trust the loading/processing lock more.

      console.log(`Scan result: ${decodedText}`);
      isScanningRef.current = true; // Lock

      // Pause scanner immediately
      html5QrcodeScanner.pause(true);

      setScanResult(decodedText);
      fetchBookingDetails(decodedText);
    };

    const onScanFailure = (error) => {
      // console.warn(`Code scan error = ${error}`);
    };

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
      scannerRef.current = null;
    };
  }, []); // Empty dependency array ensures run once

  const fetchBookingDetails = async (bookingId) => {
    setLoading(true);
    setError(null);
    setBookingDetails(null);

    try {
      const { data } = await axiosInstance.get(`/bookings/${bookingId}`);
      setBookingDetails(data.data);
      toast.success("Booking found!");
    } catch (err) {
      console.error(err);
      setError("Booking not found or access denied.");
      toast.error("Invalid QR Code or Booking not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!bookingDetails) return;
    try {
      await axiosInstance.put(`/bookings/${bookingDetails.id}/complete`);
      toast.success("Booking marked as COMPLETED.");
      setBookingDetails((prev) => ({ ...prev, status: "completed" }));
    } catch (err) {
      toast.error("Failed to update booking.");
    }
  };

  const handleReset = () => {
    setBookingDetails(null);
    setScanResult(null);
    setError(null);
    isScanningRef.current = false; // Unlock

    if (scannerRef.current) {
      try {
        scannerRef.current.resume();
      } catch (e) {
        console.warn("Scanner resume failed", e);
        // Sometimes it throws if not paused or cleared
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Scan Booking QR</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {!bookingDetails ? (
            <>
              <div id="reader" width="100%"></div>
              <p className="text-center text-gray-500 mt-4 text-sm">
                Point camera at the customer's QR code.
              </p>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-green-100 text-green-600 mb-4">
                <FaCheckCircle size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Scan Successful
              </h3>
              <button
                onClick={handleReset}
                className="mt-6 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Scan Another
              </button>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Booking Details
          </h2>

          {loading && (
            <div className="text-gray-500 animate-pulse">
              Fetching details...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <FaTimesCircle /> {error}
            </div>
          )}

          {bookingDetails && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-indigo-600">
                    {bookingDetails.Service?.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    #
                    {bookingDetails.bookingId ||
                      bookingDetails.id?.slice(0, 8) ||
                      "N/A"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${
                              bookingDetails.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : bookingDetails.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : bookingDetails.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                >
                  {bookingDetails.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="font-medium">{bookingDetails.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {bookingDetails.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>
                    {new Date(bookingDetails.startTime).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <FaClock className="text-gray-400" />
                  <span>
                    {new Date(bookingDetails.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(bookingDetails.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <FaTag className="text-gray-400" />
                  <span
                    className={
                      bookingDetails.paymentStatus === "paid"
                        ? "text-green-600 font-medium"
                        : "text-orange-500"
                    }
                  >
                    {bookingDetails.paymentStatus === "paid"
                      ? "Paid Online"
                      : "Payment Due / At Venue"}
                  </span>
                </div>
              </div>

              {bookingDetails.status !== "completed" &&
                bookingDetails.status !== "cancelled" && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={handleCheckIn}
                      className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
            </div>
          )}

          {!bookingDetails && !loading && !error && (
            <div className="text-center py-12 text-gray-400">
              <FaTag size={48} className="mx-auto mb-2 opacity-20" />
              <p>Scan a QR code to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanBooking;
