const {
  isBefore,
  isAfter,
  isEqual,
  addMinutes,
  parseISO,
} = require("date-fns");

/**
 * IntervalMath Utility
 * Handles operations on time intervals [start, end]
 */
class IntervalMath {
  /**
   * Subtracts B from A
   * @param {Array} intervalsA [[start, end], ...]
   * @param {Array} intervalsB [[start, end], ...]
   * @returns {Array} Resulting intervals
   */
  static subtract(intervalsA, intervalsB) {
    let result = [...intervalsA];

    for (const b of intervalsB) {
      const nextResult = [];
      for (const a of result) {
        // Case 1: B is entirely outside A
        if (
          isAfter(b[0], a[1]) ||
          isBefore(b[1], a[0]) ||
          isEqual(b[0], a[1]) ||
          isEqual(b[1], a[0])
        ) {
          nextResult.push(a);
        }
        // Case 2: B is entirely inside A (Splits A into two)
        else if (isAfter(b[0], a[0]) && isBefore(b[1], a[1])) {
          nextResult.push([a[0], b[0]]);
          nextResult.push([b[1], a[1]]);
        }
        // Case 3: B overlaps start of A
        else if (
          (isBefore(b[0], a[0]) || isEqual(b[0], a[0])) &&
          isAfter(b[1], a[0]) &&
          isBefore(b[1], a[1])
        ) {
          nextResult.push([b[1], a[1]]);
        }
        // Case 4: B overlaps end of A
        else if (
          isAfter(b[0], a[0]) &&
          isBefore(b[0], a[1]) &&
          (isAfter(b[1], a[1]) || isEqual(b[1], a[1]))
        ) {
          nextResult.push([a[0], b[0]]);
        }
        // Case 5: B covers entire A
        else if (
          (isBefore(b[0], a[0]) || isEqual(b[0], a[0])) &&
          (isAfter(b[1], a[1]) || isEqual(b[1], a[1]))
        ) {
          // A is gone
        }
      }
      result = nextResult;
    }

    return result;
  }

  /**
   * Intersect two sets of intervals
   */
  static intersect(intervalsA, intervalsB) {
    const result = [];
    for (const a of intervalsA) {
      for (const b of intervalsB) {
        const start = isAfter(a[0], b[0]) ? a[0] : b[0];
        const end = isBefore(a[1], b[1]) ? a[1] : b[1];

        if (isBefore(start, end)) {
          result.push([start, end]);
        }
      }
    }
    return result;
  }

  /**
   * Fits a duration into intervals with a specific stride
   */
  static fitSlots(intervals, durationMinutes, strideMinutes) {
    const slots = [];
    for (const [start, end] of intervals) {
      let current = new Date(start);
      while (
        isBefore(addMinutes(current, durationMinutes), end) ||
        isEqual(addMinutes(current, durationMinutes), end)
      ) {
        slots.push(new Date(current));
        current = addMinutes(current, strideMinutes);
      }
    }
    return slots;
  }
}

module.exports = IntervalMath;
