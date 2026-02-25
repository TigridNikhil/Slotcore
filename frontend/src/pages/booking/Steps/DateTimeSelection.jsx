import HorizontalDateScroller from "../../dashboard/components/HorizontalDate";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function DateTimeSelection({
  slots,
  selectedDate,
  onDateChange,
  onSlotSelect,
  onBack,
  loading,
  primaryColor,
}) {
  const { tenant } = useSelector((state) => state.publicBooking);
  const { schedules, overrides } = tenant || {};
  console.log(slots);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col"
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
            Select Date & Time
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 md:gap-8 min-h-0 flex-1">
        {/* Date Picker (Left on Desktop) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4">
            Pick a Date
          </label>
          <HorizontalDateScroller
            onDateSelect={onDateChange}
            initialDate={(() => {
              const d = new Date();
              d.setDate(d.getDate() + 1);
              return d;
            })()}
            schedules={schedules}
            overrides={overrides}
          />

          {selectedDate && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
              <ScheduleInfo
                date={selectedDate}
                schedules={schedules}
                overrides={overrides}
              />
            </div>
          )}
        </div>

        {/* Slots Grid (Right on Desktop) */}
        <div className="flex flex-col h-full overflow-hidden">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Available Slots
          </label>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Checking availability...
            </div>
          ) : !selectedDate ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-center p-4 border-2 border-dashed border-gray-200 rounded-xl">
              <FaCalendarAlt className="text-4xl mb-2 opacity-20" />
              <p>Select a date to view slots</p>
            </div>
          ) : !slots || slots.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              No slots available for this date.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3 overflow-y-auto max-h-[300px] md:max-h-[400px] pr-2 custom-scrollbar">
              {slots.map((slotData, idx) => {
                const isObject = typeof slotData === "object";
                const slotTime = isObject ? slotData.time : slotData;
                const available = isObject ? slotData.available : null;
                const capacity = isObject ? slotData.capacity : 1;

                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSlotSelect(slotTime)}
                    className="relative p-3 rounded-lg border border-indigo-100 font-bold text-indigo-900 hover:text-white transition-colors overflow-hidden group shadow-sm text-sm flex flex-col items-center justify-center gap-1"
                    style={{ backgroundColor: "#EEF2FF" }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    <span className="relative z-10 flex items-center justify-center gap-1">
                      {new Date(slotTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {available !== null && capacity > 1 && (
                      <span className="relative z-10 text-[10px] bg-white/80 px-2 py-0.5 rounded-full text-indigo-700 font-bold shadow-sm">
                        {available} left
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ScheduleInfo({ date, schedules, overrides }) {
  if (!schedules) return null;
  const targetDate = new Date(date);

  // 1. Check Overrides
  const override = overrides?.find((o) => {
    // careful with date comparison, string vs obj
    return new Date(o.date).toDateString() === targetDate.toDateString();
  });

  if (override) {
    if (override.isOff)
      return (
        <p className="font-medium text-red-500">
          Shop Closed (Holiday/Override)
        </p>
      );
    return (
      <div>
        <p className="font-medium">Special Hours:</p>
        <p>
          {override.startTime.slice(0, 5)} - {override.endTime.slice(0, 5)}
        </p>
      </div>
    );
  }

  // 2. Check Schedule
  const dayIndex = targetDate.getDay();
  const schedule = schedules.find((s) => s.dayOfWeek === dayIndex);

  if (!schedule || !schedule.isActive) {
    return (
      <p className="font-medium text-red-500">
        Closed on {targetDate.toLocaleDateString("en-US", { weekday: "long" })}s
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">Working Hours:</span>
        <span>
          {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
        </span>
      </div>
      {schedule.isBreakActive && (
        <div className="flex justify-between text-orange-600">
          <span className="font-medium flex items-center gap-1">
            <FaClock className="text-xs" /> Break:
          </span>
          <span>
            {schedule.breakStartTime.slice(0, 5)} -{" "}
            {schedule.breakEndTime.slice(0, 5)}
          </span>
        </div>
      )}
    </div>
  );
}
