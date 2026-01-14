import { useState, useEffect } from "react";
import { FaClock, FaCoffee, FaSave } from "react-icons/fa";

export default function AvailabilitySettings({ initialData, onSave, loading }) {
  const [availability, setAvailability] = useState({
    workingHours: { start: "09:00", end: "17:00" },
    breakTime: { start: "12:00", end: "13:00", isActive: true },
    slotGap: 0,
  });

  useEffect(() => {
    if (initialData?.settings?.availability) {
      setAvailability(initialData.settings.availability);
      // Ensure defaults if partial data
      if (!initialData.settings.availability.workingHours) {
        setAvailability((prev) => ({
          ...prev,
          workingHours: { start: "09:00", end: "17:00" },
        }));
      }
    }
  }, [initialData]);

  const handleChange = (section, field, value) => {
    if (section === "root") {
      setAvailability((prev) => ({ ...prev, [field]: value }));
    } else {
      setAvailability((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  const handleSave = () => {
    // Pass back the full settings object structure expected by the parent
    // Parent merges it into org.settings
    onSave({ availability });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaClock className="text-indigo-600" /> Working Hours
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={availability.workingHours.start}
              onChange={(e) =>
                handleChange("workingHours", "start", e.target.value)
              }
              className="w-full p-3 border rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={availability.workingHours.end}
              onChange={(e) =>
                handleChange("workingHours", "end", e.target.value)
              }
              className="w-full p-3 border rounded-lg font-mono"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaCoffee className="text-orange-500" /> Break Time
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-bold text-gray-600">
              Enable Break
            </span>
            <input
              type="checkbox"
              checked={availability.breakTime.isActive}
              onChange={(e) =>
                handleChange("breakTime", "isActive", e.target.checked)
              }
              className="w-5 h-5 text-indigo-600 rounded"
            />
          </label>
        </div>

        {availability.breakTime.isActive && (
          <div className="grid md:grid-cols-2 gap-6 opacity-100 transition-opacity">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Break Check-in (Start)
              </label>
              <input
                type="time"
                value={availability.breakTime.start}
                onChange={(e) =>
                  handleChange("breakTime", "start", e.target.value)
                }
                className="w-full p-3 border rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Break Over (End)
              </label>
              <input
                type="time"
                value={availability.breakTime.end}
                onChange={(e) =>
                  handleChange("breakTime", "end", e.target.value)
                }
                className="w-full p-3 border rounded-lg font-mono"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-6">Buffer Time</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Time Gap Between Slots (Minutes)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Break time between slots (e.g., 15 for cleaning/prep).
            </p>
            <input
              type="number"
              min="0"
              step="5"
              value={availability.slotGap}
              onChange={(e) =>
                handleChange("root", "slotGap", parseInt(e.target.value) || 0)
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-lg shadow-lg"
      >
        <FaSave /> Save Availability Rules
      </button>
    </div>
  );
}
