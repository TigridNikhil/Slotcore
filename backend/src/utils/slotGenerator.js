const { addMinutes, format, isBefore, isAfter, isEqual } = require("date-fns");

// Helper: Generate slots for a single timeline (One Staff or Org)
const generateSingleTimelineSlots = ({
  date,
  workingHours,
  existingBookings, // Only bookings relevant to this resource!
  durationMinutes,
  bufferTime = 0,
  breakTime = null,
  capacity = 1, // Usually 1 for single staff, N for org pooling
  stepMinutes = null, // Optional: if we want granular steps (e.g. 15min)
}) => {
  const slots = [];

  // Default hours if missing
  const { start: workStartStr, end: workEndStr } = workingHours || {
    start: "09:00",
    end: "17:00",
  };

  const dayStart = new Date(`${date}T${workStartStr}:00`);
  const dayEnd = new Date(`${date}T${workEndStr}:00`);

  // Step size: default to duration + buffer if not specified
  const interval = stepMinutes || durationMinutes + bufferTime;

  let iterator = new Date(dayStart);

  while (
    isBefore(addMinutes(iterator, durationMinutes), dayEnd) ||
    isEqual(addMinutes(iterator, durationMinutes), dayEnd)
  ) {
    const slotStart = new Date(iterator);
    const slotEnd = addMinutes(iterator, durationMinutes);

    // 1. Check Break Time
    let isBreak = false;
    if (
      breakTime &&
      breakTime.isBreakActive &&
      breakTime.start &&
      breakTime.end
    ) {
      const breakStart = new Date(`${date}T${breakTime.start}:00`);
      const breakEnd = new Date(`${date}T${breakTime.end}:00`);
      if (isBefore(slotStart, breakEnd) && isAfter(slotEnd, breakStart)) {
        isBreak = true;
      }
    }

    if (!isBreak) {
      // 2. Check Capacity (Overlap)
      const overlappingBookings = existingBookings.filter((booking) => {
        const bStart = new Date(booking.startTime);
        const bEnd = new Date(booking.endTime);
        // Add buffer to booking check? "Buffer is time required BEFORE/AFTER service".
        // Usually, buffer attaches to the service slot.
        // We march iterator by duration+buffer, so effectively subsequent slot starts after buffer.
        // But for overlap check, we just check physical time occupied.
        return isBefore(slotStart, bEnd) && isAfter(slotEnd, bStart);
      });

      if (overlappingBookings.length < capacity) {
        slots.push({
          time: format(slotStart, "yyyy-MM-dd'T'HH:mm:ss"),
          available: capacity - overlappingBookings.length,
          capacity: capacity,
        });
      }
    }

    iterator = addMinutes(iterator, interval);
  }
  return slots;
};

const generateSlots = (
  date,
  dateTimeZone,
  durationMinutes,
  workingHours, // Org working hours (fallback)
  existingBookings, // All bookings for service
  bufferTime = 0,
  breakTime = null, // Org break (fallback)
  capacity = 1,
  staffResources = null // Array of { id, schedule: { start, end, break... }, bookings: [] }
) => {
  // A. If specific Staff Resources are provided (e.g. Service assigned to 3 doctors)
  if (staffResources && staffResources.length > 0) {
    const allSlotsMap = new Map();

    staffResources.forEach((staff) => {
      // If staff has no schedule for today, skip (they are off)
      if (!staff.schedule) return;

      const staffSlots = generateSingleTimelineSlots({
        date,
        workingHours: { start: staff.schedule.start, end: staff.schedule.end },
        existingBookings: staff.bookings || [], // Bookings assigned to THIS staff
        durationMinutes,
        bufferTime,
        breakTime: staff.schedule.breakTime, // Staff specific break
        capacity: 1, // Individual staff has capacity 1
        stepMinutes: durationMinutes + bufferTime, // Keep stride logic consistent
      });

      staffSlots.forEach((s) => {
        // Aggregate slots?
        // If multiple staff are available at 9:00, we technically have 2 spots?
        // Wait, "Service assigned to 3 doctors".
        // Capacity = Sum of free staff?
        // Currently, we return unique start times.
        // If Dr A is free at 9:00 and Dr B is free at 9:00.
        // User sees 9:00.
        // Capacity at 9:00 should be 2.

        if (allSlotsMap.has(s.time)) {
          const existing = allSlotsMap.get(s.time);
          existing.available += s.available;
          existing.capacity += s.capacity;
        } else {
          allSlotsMap.set(s.time, { ...s });
        }
      });
    });

    // Sort and return
    return Array.from(allSlotsMap.values()).sort((a, b) =>
      a.time.localeCompare(b.time)
    );
  }

  // B. Fallback: Organization-wide Pooling (Original Logic)
  // No specific staff assigned, just check "General Capacity" against "All Bookings"
  return generateSingleTimelineSlots({
    date,
    workingHours,
    existingBookings,
    durationMinutes,
    bufferTime,
    breakTime,
    capacity,
  });
};

module.exports = generateSlots;
