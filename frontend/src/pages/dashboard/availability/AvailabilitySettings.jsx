import { useState } from "react";
import WeeklySchedule from "./WeeklySchedule";
import DateOverrides from "./DateOverrides";

export default function AvailabilitySettings() {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {" "}
        Availability Settings
      </h2>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "schedule"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setActiveTab("overrides")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "overrides"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Date Overrides
          </button>
        </nav>
      </div>

      <div>
        {activeTab === "schedule" ? <WeeklySchedule /> : <DateOverrides />}
      </div>
    </div>
  );
}
