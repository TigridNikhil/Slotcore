import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSave, FaSpinner } from "react-icons/fa";
// Org Actions
import {
  fetchSchedules,
  updateSchedules,
} from "../../../operations/availability/availabilityAction";
import {
  clearMessages,
  setSchedules,
} from "../../../operations/availability/availabilitySlice";

// Staff Actions
import {
  fetchStaffSchedule,
  updateStaffSchedule,
} from "../../../operations/availability/staffAvailabilityAction";
import { clearMessages as clearStaffMessages } from "../../../operations/availability/staffAvailabilitySlice";

import TimeSelect from "../../../components/TimeSelect";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function WeeklySchedule({ staffId = null }) {
  const dispatch = useDispatch();

  // Select appropriate state based on mode
  const orgState = useSelector((state) => state.availability);
  const staffState = useSelector((state) => state.staffAvailability);

  const { schedules, loading, error, success } = staffId
    ? staffState
    : orgState;

  const [localSchedules, setLocalSchedules] = useState([]);

  useEffect(() => {
    if (staffId) {
      dispatch(fetchStaffSchedule(staffId));
      return () => dispatch(clearStaffMessages());
    } else {
      dispatch(fetchSchedules());
      return () => dispatch(clearMessages());
    }
  }, [dispatch, staffId]);

  // Sync local state with redux state when fetching completes
  useEffect(() => {
    // If we have data, populate form
    if (schedules && schedules.length > 0) {
      const fullWeek = DAYS.map((day, index) => {
        const existing = schedules.find((d) => d.dayOfWeek === index);
        if (existing) {
          return {
            ...existing,
            breakStartTime: existing.breakStartTime || "",
            breakEndTime: existing.breakEndTime || "",
            isBreakActive: existing.isBreakActive || false,
          };
        }
        return {
          dayOfWeek: index,
          startTime: "09:00",
          endTime: "17:00",
          isActive: false, // Default closed if no record
          breakStartTime: "",
          breakEndTime: "",
          isBreakActive: false,
        };
      });
      setLocalSchedules(fullWeek);
    } else if (!loading && (!schedules || schedules.length === 0)) {
      // If empty state returned (first time), initialize defaults
      // For Staff, usually specific days, but let's default to closed or 9-5 MF
      const defaultWeek = DAYS.map((day, index) => ({
        dayOfWeek: index,
        startTime: "09:00",
        endTime: "17:00",
        isActive: index !== 0 && index !== 6,
        breakStartTime: "",
        breakEndTime: "",
        isBreakActive: false,
      }));
      setLocalSchedules(defaultWeek);
    }
  }, [schedules, loading]);

  const handleChange = (index, field, value) => {
    const newSchedules = [...localSchedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setLocalSchedules(newSchedules);
  };

  const handleSave = () => {
    const payload = localSchedules.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      isActive: s.isActive,
      breakStartTime: s.breakStartTime,
      breakEndTime: s.breakEndTime,
      isBreakActive: s.isBreakActive,
    }));

    if (staffId) {
      dispatch(updateStaffSchedule(staffId, payload));
    } else {
      dispatch(updateSchedules(payload));
    }
  };

  if (loading && localSchedules.length === 0)
    return <div>Loading schedule...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Weekly Working Hours
        </h3>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSave />} Save
          Changes
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {localSchedules.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col gap-4 p-4 rounded border ${
              day.isActive
                ? "border-gray-200 bg-white"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-32 font-medium text-gray-700">
                {DAYS[index]}
              </div>

              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={day.isActive}
                    onChange={(e) =>
                      handleChange(index, "isActive", e.target.checked)
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 min-w-[60px]">
                    {day.isActive ? "Open" : "Closed"}
                  </span>
                </label>
              </div>

              {day.isActive && (
                <div className="flex items-center gap-2 ml-4">
                  <TimeSelect
                    value={day.startTime}
                    onChange={(val) => handleChange(index, "startTime", val)}
                    className="w-32"
                  />
                  <span className="text-gray-400 text-sm font-medium">to</span>
                  <TimeSelect
                    value={day.endTime}
                    onChange={(val) => handleChange(index, "endTime", val)}
                    className="w-32"
                  />
                </div>
              )}
            </div>

            {day.isActive && (
              <div className="ml-0 md:ml-36 pl-4 border-l-2 border-indigo-100 mt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={day.isBreakActive || false}
                      onChange={(e) =>
                        handleChange(index, "isBreakActive", e.target.checked)
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-gray-300"
                    />
                    <span className="font-medium">Enable Break</span>
                  </label>

                  {day.isBreakActive && (
                    <div className="flex items-center gap-2 animate-fadeIn">
                      <TimeSelect
                        value={day.breakStartTime}
                        onChange={(val) =>
                          handleChange(index, "breakStartTime", val)
                        }
                        className="w-28"
                        minTime={day.startTime}
                        maxTime={day.endTime}
                      />
                      <span className="text-gray-400 text-xs font-medium">
                        to
                      </span>
                      <TimeSelect
                        value={day.breakEndTime}
                        onChange={(val) =>
                          handleChange(index, "breakEndTime", val)
                        }
                        className="w-28"
                        minTime={day.breakStartTime || day.startTime}
                        maxTime={day.endTime}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
