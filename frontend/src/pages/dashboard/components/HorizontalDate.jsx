import React, { useState, useEffect, useRef, useCallback } from "react";
import { BsChevronRight } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa6";
import { format, isSameDay } from "date-fns";

const HorizontalDateScroller = ({
  onDateSelect,
  mode = "date",
  initialDate = new Date(),
  schedules = [],
  overrides = [],
}) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const scrollContainerRef = useRef(null);

  // Helper to get local YYYY-MM-DD
  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Memoize the initial date string to prevent unnecessary changes
  const initialDateString = getLocalDateString(initialDate);

  // Generate items based on mode - memoized to prevent recreation
  const generateItems = useCallback(() => {
    const today = initialDate || new Date();
    const itemsArray = [];

    if (mode === "date") {
      // Date mode - generate days
      for (let i = 0; i < 30; i++) {
        // Show next 30 days
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        itemsArray.push(date);
      }
    } else {
      // Month mode - generate months
      for (let i = 0; i < 12; i++) {
        const date = new Date(today);
        date.setDate(1); // prevent month overflow
        date.setMonth(today.getMonth() + i);
        itemsArray.push(date);
      }
    }

    return itemsArray;
  }, [mode, initialDateString]); // Only recreate when mode or date string changes

  useEffect(() => {
    setItems(generateItems());
    // Auto select first available if needed, usually parent handles logic or we default to initial
    // But we don't want to auto-select a closed day.
    // For now, keep simple behavior
    setSelectedItem(initialDateString);
  }, [generateItems, initialDateString]);

  const isDateClosed = (date) => {
    if (mode !== "date") return false;

    // 1. Check Overrides
    const override = overrides.find((o) => isSameDay(new Date(o.date), date));
    if (override && override.isOff) {
      return true;
    }
    // If override exists and isOff is false, it's OPEN (custom hours), so NOT closed.
    if (override && !override.isOff) {
      return false;
    }

    // 2. Check Weekly Schedule
    const dayOfWeek = date.getDay(); // 0-6
    const schedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);

    // If schedule row exists, check isActive.
    if (schedule) {
      return !schedule.isActive;
    }
    // Fallback default: Open mon-fri? Or just Open?
    // Let's assume Valid SChedule Rows exist for all days if managed properly.
    return false;
  };

  const handleItemClick = (item) => {
    if (isDateClosed(item)) return; // Disable clicking closed dates

    const dateString = getLocalDateString(item);
    setSelectedItem(dateString);
    if (onDateSelect) {
      onDateSelect(dateString);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  // Formatting functions
  const formatDay = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short" });
  const formatDate = (date) => date.getDate();
  const formatMonth = (date) =>
    date.toLocaleDateString("en-US", { month: "short" });
  const formatYear = (date) => date.getFullYear();

  const isCurrent = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const isSelected = (date) => {
    if (!selectedItem) return false;
    const dateString = getLocalDateString(date);
    return dateString === selectedItem;
  };

  return (
    <div className="relative w-full group">
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-100 p-2 rounded-full shadow-lg text-gray-400 hover:text-indigo-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-300"
        aria-label="Scroll left"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-3 px-4 py-2 w-full"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((date) => {
          const dateString = getLocalDateString(date);
          const selected = isSelected(date);
          const current = isCurrent(date);
          const closed = isDateClosed(date);

          return (
            <div
              key={dateString}
              onClick={() => handleItemClick(date)}
              className={`
                flex flex-col items-center justify-center min-w-[4rem] sm:min-w-[4.5rem] h-16 sm:h-20 rounded-xl sm:rounded-2xl transition-all duration-200 border
                ${
                  closed
                    ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }
                ${
                  !closed && selected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md transform scale-105"
                    : !closed &&
                      "bg-white border-gray-100 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50"
                }
                ${
                  !closed && !selected && current
                    ? "ring-2 ring-indigo-100 ring-offset-2"
                    : ""
                }
              `}
              style={{ scrollSnapAlign: "center" }}
            >
              {mode === "date" ? (
                <>
                  <span
                    className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                      selected
                        ? "text-indigo-200"
                        : closed
                          ? "text-gray-300"
                          : "text-gray-400"
                    }`}
                  >
                    {formatDay(date)}
                  </span>
                  <span
                    className={`text-xl font-bold leading-none ${
                      selected
                        ? "text-white"
                        : closed
                          ? "text-gray-300"
                          : "text-gray-800"
                    }`}
                  >
                    {formatDate(date)}
                  </span>
                  {current && !selected && !closed && (
                    <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1"></span>
                  )}
                </>
              ) : (
                <>
                  <span
                    className={`text-sm font-bold ${
                      selected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {formatMonth(date)}
                  </span>
                  <span
                    className={`text-xs ${
                      selected ? "text-indigo-200" : "text-gray-400"
                    }`}
                  >
                    {formatYear(date)}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-100 p-2 rounded-full shadow-lg text-gray-400 hover:text-indigo-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-300"
        aria-label="Scroll right"
      >
        <BsChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default HorizontalDateScroller;
