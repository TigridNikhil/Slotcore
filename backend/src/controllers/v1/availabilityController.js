const {
  Booking,
  Service,
  Schedule,
  AvailabilityOverride,
  StaffSchedule,
} = require("../../models");
const generateSlots = require("../../utils/slotGenerator");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

const availabilityController = {
  /**
   * Public API: GET /v1/availability
   */
  getAvailability: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        service_id,
        service_ids, // Support multi-service
        date,
        org_id, // Allow passing org_id (optional if we have tenant)
      } = req.query;

      const targetServiceIds = service_ids
        ? service_ids.split(",").filter((id) => id)
        : service_id
          ? [service_id]
          : [];

      if (targetServiceIds.length === 0 || !date) {
        return res.badRequest("Date and Service ID(s) required");
      }

      // 1. Fetch Services to get total duration
      const services = await Service.findAll({
        where: { id: targetServiceIds },
        include: [{ association: "staff", attributes: ["id", "name"] }],
      });

      if (services.length === 0) return res.notFound("Service(s) not found");

      // Use primary service for rules (first one)
      const primaryService = services[0];
      const assignedStaff = primaryService.staff || [];
      const dayOfWeek = new Date(date).getDay(); // 0-6
      const startOfDay = new Date(`${date}T00:00:00Z`);
      const endOfDay = new Date(`${date}T23:59:59Z`);

      // Determine Org ID (robustly)
      const resolvedOrgId = org_id || req.tenant?.id || primaryService.orgId;

      // Calculate total duration
      const totalDuration = services.reduce(
        (acc, s) => acc + (s.durationMin || 0),
        0,
      );

      // Determine context: Organization vs Staff
      let staffResources = [];

      // A. If Staff are assigned, we use Staff Schedules
      if (assignedStaff.length > 0) {
        const staffIds = assignedStaff.map((s) => s.id);
        const staffSchedules = await StaffSchedule.findAll({
          where: {
            userId: staffIds,
            dayOfWeek,
            isActive: true,
          },
        });

        // Fetch staff-specific bookings
        const staffBookings = await Booking.findAll({
          where: {
            orgId: resolvedOrgId,
            staffId: staffIds,
            status: { [Op.ne]: "cancelled" },
            startTime: { [Op.between]: [startOfDay, endOfDay] },
          },
        });

        // Construct resources
        staffResources = assignedStaff
          .map((staff) => {
            const schedule = staffSchedules.find((s) => s.userId === staff.id);
            if (!schedule) return null; // This staff is not working today

            const myBookings = staffBookings.filter(
              (b) => b.staffId === staff.id,
            );

            return {
              id: staff.id,
              schedule: {
                start: schedule.startTime.slice(0, 5),
                end: schedule.endTime.slice(0, 5),
                breakTime:
                  schedule.isBreakActive &&
                  schedule.breakStartTime &&
                  schedule.breakEndTime
                    ? {
                        start: schedule.breakStartTime.slice(0, 5),
                        end: schedule.breakEndTime.slice(0, 5),
                        isBreakActive: true,
                      }
                    : null,
              },
              bookings: myBookings,
            };
          })
          .filter((r) => r !== null);
      }

      // B. Organization Rules (Fallback or Foundation)
      const orgSchedule = await Schedule.findOne({
        where: { orgId: resolvedOrgId, dayOfWeek, isActive: true },
      });

      // Fetch overrides: Generic (serviceId=null) OR Specific (serviceId=primaryService.id)
      const overrides = await AvailabilityOverride.findAll({
        where: {
          orgId: resolvedOrgId,
          date: new Date(date),
          [Op.or]: [{ serviceId: null }, { serviceId: primaryService.id }],
        },
      });

      const specificOverride = overrides.find(
        (o) => o.serviceId === primaryService.id,
      );
      const genericOverride = overrides.find((o) => o.serviceId === null);
      const activeOverride = specificOverride || genericOverride;

      let orgWorkingHours = null;
      let orgBreakTime = null;
      let isOrgOff = false;

      if (activeOverride) {
        if (activeOverride.isOff) isOrgOff = true;
        else {
          orgWorkingHours = {
            start: activeOverride.startTime.slice(0, 5),
            end: activeOverride.endTime.slice(0, 5),
          };
        }
      } else if (orgSchedule) {
        orgWorkingHours = {
          start: orgSchedule.startTime.slice(0, 5),
          end: orgSchedule.endTime.slice(0, 5),
        };
        if (orgSchedule.isBreakActive) {
          orgBreakTime = {
            start: orgSchedule.breakStartTime.slice(0, 5),
            end: orgSchedule.breakEndTime.slice(0, 5),
            isBreakActive: true,
          };
        }
      } else {
        orgWorkingHours = { start: "09:00", end: "17:00" };
      }

      if (isOrgOff) {
        return res.apiResponse([], "availability_slot");
      }

      // 3. Fetch General Bookings (Legacy or generic)
      let genericBookings = [];
      const useStaffLogic = assignedStaff.length > 0;

      if (!useStaffLogic) {
        genericBookings = await Booking.findAll({
          where: {
            orgId: resolvedOrgId,
            status: { [Op.ne]: "cancelled" },
            startTime: { [Op.between]: [startOfDay, endOfDay] },
          },
        });
      } else if (staffResources.length === 0) {
        return res.apiResponse([], "availability_slot");
      }

      // 4. Generate Slots
      const bufferTime = primaryService.bufferTime || 0;
      const capacity = primaryService.capacity || 1;
      const maxBookings = primaryService.maxBookingsPerDay || null;

      // Check Max Bookings Limit
      const totalServiceBookings = await Booking.count({
        where: {
          orgId: resolvedOrgId,
          serviceId: primaryService.id,
          status: { [Op.ne]: "cancelled" },
          startTime: { [Op.between]: [startOfDay, endOfDay] },
        },
      });

      if (maxBookings && totalServiceBookings >= maxBookings) {
        return res.apiResponse([], "availability_slot");
      }

      const slots = generateSlots(
        date,
        "UTC",
        totalDuration,
        orgWorkingHours,
        genericBookings,
        bufferTime,
        orgBreakTime,
        capacity,
        staffResources,
      );

      return res.apiResponse(slots, "availability_slot");
    } catch (error) {
      console.error("Availability Controller Error:", error);
      res.serverError(error.message, "Error calculating availability");
    }
  },
};

module.exports = availabilityController;
