import React from "react";
import { motion } from "framer-motion";
import { FaClock, FaTag, FaArrowRight, FaCheck } from "react-icons/fa";

export default function ServiceSelection({
  services,
  onContinue,
  primaryColor,
}) {
  const [selectedIds, setSelectedIds] = React.useState([]);

  const toggleService = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const selectedServices = services.filter((s) => selectedIds.includes(s.id));
  const totalDuration = selectedServices.reduce(
    (acc, s) => acc + s.durationMin,
    0
  );
  const totalPrice = selectedServices.reduce(
    (acc, s) => acc + parseFloat(s.price || 0),
    0
  );
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Choose a Service
      </h2>
      <p className="text-gray-500 mb-8">
        Select one or more services you would like to book today.
      </p>

      <div className="grid gap-4 custom-scrollbar overflow-y-auto h-[calc(100vh-20rem)] pb-4">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => toggleService(service.id)}
            className={`group p-5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
              selectedIds.includes(service.id)
                ? "border-2 shadow-lg"
                : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-lg"
            }`}
            style={{
              borderColor: selectedIds.includes(service.id)
                ? primaryColor
                : undefined,
            }}
          >
            <div className="flex items-center gap-4">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  className="w-16 h-16 rounded-lg object-cover"
                  alt=""
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
                  {service.name.charAt(0)}
                </div>
              )}
              <div>
                <h3
                  className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors"
                  style={{ color: "inherit" }}
                >
                  {service.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <FaClock className="text-xs" /> {service.durationMin || 30}{" "}
                    mins
                  </span>
                  <span className="flex items-center gap-1">
                    <FaTag className="text-xs" /> {service.price}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform ${
                selectedIds.includes(service.id)
                  ? "text-white scale-110"
                  : "bg-gray-50 text-gray-400 group-hover:text-white group-hover:translate-x-1"
              }`}
              style={{
                backgroundColor: selectedIds.includes(service.id)
                  ? primaryColor
                  : "var(--hover-bg)",
              }}
            >
              {selectedIds.includes(service.id) ? (
                <FaCheck />
              ) : (
                <FaArrowRight />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-auto pt-6 border-t border-gray-100 bg-white"
        >
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <span>
              {selectedServices.length} service
              {selectedServices.length > 1 ? "s" : ""} selected
            </span>
            <div className="text-right">
              <span className="block font-bold text-gray-900 text-lg">
                ${totalPrice.toFixed(2)}
              </span>
              <span className="text-xs">{totalDuration} mins</span>
            </div>
          </div>
          <button
            onClick={() => onContinue(selectedServices)}
            className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            Continue <FaArrowRight />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
