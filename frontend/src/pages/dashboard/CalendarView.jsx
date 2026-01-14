import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { getBookings } from "../../operations/booking/bookingAction";

export default function CalendarView() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.booking);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Fetch bookings when component mounts or date changes
    // Ideally, we'd filter fetching by date range here optimization
    dispatch(getBookings({}));
  }, [dispatch]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return days;
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const traverseMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  // Generate calendar grid
  const days = [];
  // Add empty slots for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  // Helper to check if a booking falls on a specific day
  const getBookingsForDay = (day) => {
    if (!day) return [];
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.startTime);
      return (
        bookingDate.getDate() === day.getDate() &&
        bookingDate.getMonth() === day.getMonth() &&
        bookingDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <FaCalendarAlt className="text-primary-600" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => traverseMonth(-1)}
              className="p-1 hover:bg-white hover:shadow-sm rounded transition-all text-neutral-600"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 text-xs font-semibold text-neutral-600 hover:text-primary-600 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => traverseMonth(1)}
              className="p-1 hover:bg-white hover:shadow-sm rounded transition-all text-neutral-600"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
        <div>{/* Legend or Filters could go here */}</div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 overflow-y-auto">
        {days.map((day, index) => {
          const dayBookings = getBookingsForDay(day);

          return (
            <div
              key={index}
              className={`min-h-[120px] border-b border-r border-neutral-100 p-2 transition-colors relative group
                ${!day ? "bg-neutral-50/30" : "hover:bg-neutral-50"}
                ${isToday(day) ? "bg-primary-50/30" : ""}
              `}
            >
              {day && (
                <>
                  <div
                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-2
                      ${
                        isToday(day)
                          ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                          : "text-neutral-700"
                      }
                    `}
                  >
                    {day.getDate()}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                    {dayBookings.map((booking) => (
                      <motion.div
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={booking.id}
                        className={`text-xs p-1.5 rounded border border-l-4 cursor-pointer hover:shadow-md transition-all
                          ${
                            booking.status === "confirmed"
                              ? "bg-green-50 border-green-200 border-l-green-500 text-green-700"
                              : booking.status === "cancelled"
                              ? "bg-red-50 border-red-200 border-l-red-500 text-red-700 opacity-60"
                              : "bg-yellow-50 border-yellow-200 border-l-yellow-500 text-yellow-700"
                          }
                        `}
                      >
                        <div className="font-semibold truncate flex items-center gap-1">
                          <FaClock className="text-[10px] opacity-70" />
                          {new Date(booking.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="truncate opacity-90 flex items-center gap-1 mt-0.5">
                          <FaUser className="text-[10px] opacity-70" />
                          {booking.customerName}
                        </div>
                        <div className="mt-0.5 text-[0.65rem] truncate opacity-75 font-medium">
                          {booking.Service?.name || "Service"}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
