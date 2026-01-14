import React, { useState, useEffect, useRef, useCallback } from "react";
import { BsChevronRight } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa6";

const BookingHorizontalDateScroller = ({
  onDateSelect,
  mode = "date",
  initialDate = new Date(),
}) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const scrollContainerRef = useRef(null);

  // Memoize the initial date string to prevent unnecessary changes
  const initialDateString = initialDate.toISOString().split("T")[0];

  // Generate items based on mode - memoized to prevent recreation
  const generateItems = useCallback(() => {
    const today = initialDate || new Date();
    const itemsArray = [];

    if (mode === "date") {
      // Date mode - generate days
      for (let i = -7; i < 15; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        itemsArray.push(date);
      }
    } else {
      // Month mode - generate months
      // for (let i = -6; i < 7; i++) {
      //   const date = new Date(today);
      //   date.setMonth(today.getMonth() + i);
      //   itemsArray.push(date);
      // }
      for (let i = -6; i < 7; i++) {
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
    setSelectedItem(initialDateString); // This uses date string "YYYY-MM-DD"
    setSelectedItem(initialDateString);
  }, [generateItems, initialDateString]);

  // Rest of your component remains the same...
  const handleItemClick = (item) => {
    const dateString = item.toISOString().split("T")[0];
    setSelectedItem(dateString);
    if (onDateSelect) {
      onDateSelect(dateString);
    }
  };

  // const scroll = (direction) => {
  //   if (scrollContainerRef.current) {
  //     const scrollAmount = direction === "left" ? -200 : 200;
  //     scrollContainerRef.current.scrollBy({
  //       left: scrollAmount,
  //       behavior: "smooth",
  //     });
  //   }
  // };
  //  const scrollLeft = () => {
  //   const firstDate = items[0];
  //   const newItems = [];
  //   for (let i = -7; i < 0; i++) {
  //     const date = new Date(firstDate);
  //     date.setDate(firstDate.getDate() + i);
  //     newItems.push(date);
  //   }
  //   setItems((prev) => [...newItems, ...prev]);

  //   // Scroll left smoothly
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  //   }
  // };

  // const scrollRight = () => {
  //   const lastDate = items[items.length - 1];
  //   const newItems = [];
  //   for (let i = 1; i <= 7; i++) {
  //     const date = new Date(lastDate);
  //     date.setDate(lastDate.getDate() + i);
  //     newItems.push(date);
  //   }
  //   setItems((prev) => [...prev, ...newItems]);

  //   // Scroll right smoothly
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  //   }
  // };
  const scrollLeft = () => {
    if (!items.length) return;

    const firstDate = items[0];
    const newItems = [];

    for (let i = 1; i <= 6; i++) {
      const date = new Date(firstDate);

      if (mode === "date") {
        date.setDate(firstDate.getDate() - i);
      } else {
        date.setMonth(firstDate.getMonth() - i);
      }

      newItems.unshift(date);
    }

    setItems((prev) => [...newItems, ...prev]);

    scrollContainerRef.current?.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!items.length) return;

    const lastDate = items[items.length - 1];
    const newItems = [];

    for (let i = 1; i <= 6; i++) {
      const date = new Date(lastDate);

      if (mode === "date") {
        date.setDate(lastDate.getDate() + i);
      } else {
        date.setMonth(lastDate.getMonth() + i);
      }

      newItems.push(date);
    }

    setItems((prev) => [...prev, ...newItems]);

    scrollContainerRef.current?.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };

  // Formatting functions
  const formatDay = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDate = (date) => {
    return date.getDate();
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  const formatYear = (date) => {
    return date.getFullYear();
  };

  const isCurrent = (date) => {
    const today = initialDate || new Date();
    if (mode === "date") {
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    } else {
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }
  };

  const isSelected = (date) => {
    if (!selectedItem) return false;
    const dateString = date.toISOString().split("T")[0];
    return dateString === selectedItem;
  };

  return (
    <div className="relative w-full">
      <button
        // onClick={() => scroll("left")}
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100"
        aria-label="Scroll left"
      >
        <FaChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 px-10 py-4 w-full justify-between"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((date) => {
          const dateString = date.toISOString().split("T")[0];
          return (
            <div
              key={dateString}
              onClick={() => handleItemClick(date)}
              className={`flex flex-col items-center justify-center min-w-16 h-16 rounded-lg cursor-pointer transition-colors
                ${isCurrent(date) ? "border-2 border-primary" : ""}
                ${
                  isSelected(date)
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200"
                }
              `}
              style={{ scrollSnapAlign: "center" }}
              aria-selected={isSelected(date)}
            >
              {mode === "date" ? (
                <>
                  <span className="text-lg font-bold">{formatDate(date)}</span>
                  <span className="text-xs font-medium">{formatDay(date)}</span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold">{formatMonth(date)}</span>
                  <span className="text-xs">{formatYear(date)}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button
        // onClick={() => scroll("right")}
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        aria-label="Scroll right"
      >
        <BsChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default BookingHorizontalDateScroller;
