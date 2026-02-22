import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { FaClock, FaTag, FaArrowRight, FaCheck } from "react-icons/fa";

export default function ServiceSelection({
  services = [],
  onContinue,
  primaryColor = "#4f46e5",
}) {
  const [selectedIds, setSelectedIds] = React.useState([]);

  const isSingle = services.length === 1;

  const toggleService = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
    );
  }, []);

  const selectedServices = useMemo(
    () => services.filter((s) => selectedIds.includes(s.id)),
    [services, selectedIds],
  );

  const totalDuration = useMemo(
    () => selectedServices.reduce((acc, s) => acc + (s.durationMin || 30), 0),
    [selectedServices],
  );

  const totalPrice = useMemo(
    () =>
      selectedServices.reduce((acc, s) => acc + parseFloat(s.price || 0), 0),
    [selectedServices],
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b">
        <h2 className="text-2xl font-bold text-gray-900">
          {isSingle ? "Our Service" : "Choose a Service"}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          {isSingle
            ? "Select the service below to continue with your booking."
            : "Select one or more services you would like to book today."}
        </p>
      </div>

      {/* Service List */}
      <div className="h-[400px] overflow-y-auto">
        <div className="flex-1  px-6 py-5 space-y-4">
          {services.map((service, idx) => {
            const isSelected = selectedIds.includes(service.id);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => toggleService(service.id)}
                className={`group bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? "shadow-lg border-2"
                    : "border-gray-100 hover:shadow-md"
                }`}
                style={{
                  borderColor: isSelected ? primaryColor : undefined,
                }}
              >
                <div className="flex gap-4 items-start">
                  {/* Image */}
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold">
                      {service.name.charAt(0)}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {service.name}
                    </h3>

                    {service.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {service.durationMin || 30} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <FaTag className="text-xs" />₹{service.price}
                      </span>
                    </div>
                  </div>

                  {/* Select Indicator */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? "text-white scale-110"
                        : "bg-gray-100 text-gray-400 group-hover:translate-x-1"
                    }`}
                    style={{
                      backgroundColor: isSelected ? primaryColor : "#f3f4f6",
                    }}
                  >
                    {isSelected ? <FaCheck /> : <FaArrowRight />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sticky Footer */}
      {selectedServices.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-600">
              {selectedServices.length} selected
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ₹{totalPrice.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">{totalDuration} mins</div>
            </div>
          </div>

          <button
            onClick={() => onContinue(selectedServices)}
            className="w-full py-3 rounded-xl font-semibold text-white text-lg transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
