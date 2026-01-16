import { motion } from "framer-motion";
import { FaCheckCircle, FaFileInvoiceDollar } from "react-icons/fa";
import { axiosInstance } from "../../../utils/baseurl";

export default function SuccessStep({ onReset, primaryColor, booking }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col items-center justify-center text-center p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-5xl mb-6"
      >
        <FaCheckCircle />
      </motion.div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Booking Confirmed!
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Your appointment has been successfully scheduled. We've sent a
        confirmation email with all the details.
        {booking && booking.bookingId && (
          <span className="block mt-4 font-mono font-bold text-gray-800 bg-gray-100 py-2 rounded">
            Booking ID: {booking.bookingId}
          </span>
        )}
      </p>

      <div className="flex gap-4">
        {console.log("SuccessStep Booking:", booking)}
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          Book Another
        </button>

        {booking && booking.id && (
          <button
            onClick={async () => {
              try {
                const response = await axiosInstance.get(
                  `/bookings/${booking.id}/invoice`,
                  {
                    responseType: "blob",
                    headers: {},
                  }
                );
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                  "download",
                  `Receipt-${booking.bookingId || booking.id.slice(0, 8)}.pdf`
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
              } catch (error) {
                console.error("Receipt Download Error", error);
                alert("Could not download receipt. Please check your email.");
              }
            }}
            className="px-6 py-3 rounded-full font-bold text-gray-700 bg-white border border-gray-200 shadow hover:shadow-md transition-all flex items-center gap-2"
          >
            <FaFileInvoiceDollar /> Receipt
          </button>
        )}
      </div>
    </motion.div>
  );
}
