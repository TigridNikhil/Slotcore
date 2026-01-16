import { useState } from "react";
import { motion } from "framer-motion";
import { FaCreditCard, FaStore, FaWallet } from "react-icons/fa";
import { axiosInstance } from "../../../utils/baseurl";

// Helper to format currency
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

export default function PaymentStep({
  services,
  slot,
  customerData,
  onBack,
  onSubmit,
  loading,
  primaryColor,
}) {
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' | 'venue'

  const totalAmount = services.reduce(
    (acc, s) => acc + (parseFloat(s.price) || 0),
    0
  );

  const handlePay = () => {
    onSubmit({ paymentMethod });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Booking Summary */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Service(s)</span>
              <div className="text-right">
                {services.map((s) => (
                  <div key={s.id} className="font-medium text-gray-900">
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium text-gray-900">
                {new Date(slot).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium text-gray-900">
                {customerData.name}
              </span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-base font-bold">
              <span>Total</span>
              <span style={{ color: primaryColor }}>
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-4">
          <label
            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
              paymentMethod === "online"
                ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setPaymentMethod("online")}
          >
            <input
              type="radio"
              name="payment"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
              className="w-4 h-4 text-indigo-600"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <FaCreditCard className="text-indigo-500" /> Pay Online
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cards, UPI, Netbanking (Razorpay)
              </p>
            </div>
          </label>

          <label
            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
              paymentMethod === "venue"
                ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setPaymentMethod("venue")}
          >
            <input
              type="radio"
              name="payment"
              value="venue"
              checked={paymentMethod === "venue"}
              onChange={() => setPaymentMethod("venue")}
              className="w-4 h-4 text-indigo-600"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <FaStore className="text-green-500" /> Pay at Venue
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cash or Card at the location
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePay}
          disabled={loading}
          className="flex-1 py-3 px-6 rounded-lg text-white font-medium shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ backgroundColor: primaryColor }}
        >
          {loading
            ? "Processing..."
            : paymentMethod === "online"
            ? `Pay ${formatPrice(totalAmount)}`
            : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
