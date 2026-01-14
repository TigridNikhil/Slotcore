import { useState, useEffect } from "react";

export default function SlotPicker({
  selectedDate,
  onDateChange,
  slots,
  onSlotSelect,
  loading,
}) {
  // Simple Date handling for MVP
  // Ideally use a Calendar library like react-day-picker

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pick a Date
        </label>
        <input
          type="date"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {selectedDate && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Available Times
          </h4>
          {loading && (
            <p className="text-sm text-gray-500">Checking availability...</p>
          )}
          {!loading && slots.length === 0 && (
            <p className="text-sm text-red-500">
              No slots available on this date.
            </p>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => onSlotSelect(slot)}
                className="px-4 py-2 bg-white text-indigo-700 rounded hover:bg-indigo-50 text-sm font-medium border border-gray-200 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                {new Date(slot).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
