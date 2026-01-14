import React from "react";
import WeeklySchedule from "./WeeklySchedule";

export default function StaffAvailabilitySettings({
  staffId,
  staffName,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Availability for: {staffName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Define the working hours for this specific staff member. These hours
            will override the organization's general availability when this
            staff member is assigned to a service.
          </p>
          <WeeklySchedule staffId={staffId} />
        </div>
      </div>
    </div>
  );
}
