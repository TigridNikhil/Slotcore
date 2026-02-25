import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";

export default function UserDetails({
  onSubmit,
  onBack,
  services,
  service, // Fallback
  slot,
  primaryColor,
  loading,
  initialData,
}) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    mobile: initialData?.mobile || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Handle both array and single (legacy) service prop
  const activeServices = services || (service ? [service] : []);
  const totalPrice = activeServices.reduce(
    (acc, s) => acc + parseFloat(s.price || 0),
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col"
    >
      <div className="flex items-center gap-4 mb-4 md:mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Final Details
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Confirm your appointment
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-6 md:mb-8 border border-gray-100">
        <h3 className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4">
          Summary
        </h3>

        {activeServices.map((svc) => (
          <div key={svc.id} className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-900 text-lg">{svc.name}</span>
            <span className="font-medium text-gray-700">{svc.price}</span>
          </div>
        ))}

        <div className="border-t border-dashed border-gray-300 my-2 pt-2 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total</span>
          <div className="flex items-center gap-1 font-bold text-green-600">
            <BsCashCoin /> {totalPrice.toFixed(2)}
          </div>
        </div>
        <div className="text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {new Date(slot).toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          at{" "}
          {new Date(slot).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                required
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all"
                placeholder="123-456-7890"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all h-24"
              placeholder="Any special requests?"
            />
          </div>
        </div>

        {/* <div className="bg-white p-4 rounded-lg border-2 border-green-500 bg-green-50/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <BsCashCoin size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Pay at Venue</p>
              <p className="text-xs text-gray-500">Cash or card upon arrival</p>
            </div>
          </div>
          <FaCheck className="text-green-500" />
        </div> */}

        <button
          disabled={loading}
          type="submit"
          className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          style={{ backgroundColor: primaryColor }}
        >
          {loading ? (
            "Confirming..."
          ) : (
            <>
              <FaCheck /> Confirm Booking
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
