import React, { useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";

const TimeSelect = ({
  value,
  onChange,
  className = "",
  disabled = false,
  minTime,
  maxTime,
}) => {
  const timeOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        // 15-minute intervals for better precision
        const hour = i.toString().padStart(2, "0");
        const minute = j.toString().padStart(2, "0");
        const time24 = `${hour}:${minute}`;

        // Filter based on minTime/maxTime if provided
        if (minTime && time24 < minTime) continue;
        if (maxTime && time24 > maxTime) continue;

        // Format for display (12-hour format)
        const period = i >= 12 ? "PM" : "AM";
        const displayHour = i === 0 ? 12 : i > 12 ? i - 12 : i;
        const displayTime = `${displayHour}:${minute} ${period}`;

        options.push({ value: time24, label: displayTime });
      }
    }
    // Add end of day option if needed, but 23:45 is usually last start time.
    return options;
  }, [minTime, maxTime]);

  return (
    <div className={`relative ${className}`}>
      <select
        value={value ? value.slice(0, 5) : ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="appearance-none w-full bg-white border border-gray-300 hover:border-indigo-400 px-3 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm transition-all cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
      >
        <option value="" disabled>
          Select Time
        </option>
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
        <FaChevronDown className="w-3 h-3" />
      </div>
    </div>
  );
};

export default TimeSelect;
