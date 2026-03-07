const IntervalMath = require("./IntervalMath");
const { format, startOfDay, endOfDay } = require("date-fns");

/**
 * CoreSchedulingEngine
 * Orchestrates interval operations to find availability
 */
class CoreSchedulingEngine {
  /**
   * Calculates free intervals for a single resource on a specific date
   */
  static async calculateResourceAvailability(
    resourceSettings,
    existingBookings,
    date,
    bufferTime = 0,
  ) {
    const {
      startTime,
      endTime,
      breakStart,
      breakEnd,
      isBreakActive,
      capacity = 1,
    } = resourceSettings;

    // 1. Initial window
    const dayStart = new Date(`${date}T${startTime}:00`);
    const dayEnd = new Date(`${date}T${endTime}:00`);
    let freeIntervals = [[dayStart, dayEnd]];

    // 2. Subtract Break
    if (isBreakActive && breakStart && breakEnd) {
      const bStart = new Date(`${date}T${breakStart}:00`);
      const bEnd = new Date(`${date}T${breakEnd}:00`);
      freeIntervals = IntervalMath.subtract(freeIntervals, [[bStart, bEnd]]);
    }

    // 3. Subtract Bookings (With Buffer)
    // We treat buffer as time added AFTER the service.
    const bookingIntervals = existingBookings.map((b) => {
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      // Add buffer to the interval being subtracted
      const endWithBuffer = new Date(end.getTime() + bufferTime * 60000);
      return [start, endWithBuffer];
    });

    // Handle Capacity: If capacity > 1, we only subtract intervals where
    // the number of overlapping bookings reaches capacity.
    if (capacity > 1) {
      // Logic for multi-capacity resources
      // For now, if capacity > 1, find chunks where count < capacity.
      // Simplest fallback: treat as individual segments.
      // Better: Use IntervalMath.subtract only if all "sub-slots" taken.
      // This is a placeholder for true capacity logic.
      freeIntervals = IntervalMath.subtract(freeIntervals, bookingIntervals);
    } else {
      freeIntervals = IntervalMath.subtract(freeIntervals, bookingIntervals);
    }

    return freeIntervals;
  }

  /**
   * Main entry point for availability lookup
   */
  static async getAvailability(options) {
    const { date, resources, duration, stride } = options;

    // Aggregate availability across all provided resources
    const allSlotsByTime = new Map();

    for (const resource of resources) {
      const intervals = await this.calculateResourceAvailability(
        resource.settings,
        resource.bookings,
        date,
        options.bufferTime || 0,
      );

      const slots = IntervalMath.fitSlots(
        intervals,
        duration,
        stride || duration,
      );

      slots.forEach((slot) => {
        const timeKey = format(slot, "yyyy-MM-dd'T'HH:mm:ss");
        if (allSlotsByTime.has(timeKey)) {
          allSlotsByTime.get(timeKey).available_resources.push(resource.id);
        } else {
          allSlotsByTime.set(timeKey, {
            time: timeKey,
            available_resources: [resource.id],
          });
        }
      });
    }

    return Array.from(allSlotsByTime.values()).sort((a, b) =>
      a.time.localeCompare(b.time),
    );
  }
}

module.exports = CoreSchedulingEngine;
