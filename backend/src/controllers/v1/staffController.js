const { User, StaffSchedule } = require("../../models");

const staffController = {
  listStaff: async (req, res) => {
    try {
      const staff = await User.findAll({
        where: { orgId: req.orgId, role: "staff" },
        attributes: ["id", "name", "email", "title", "bio", "avatarUrl"],
      });
      return res.successResponse(staff);
    } catch (error) {
      return res.serverError(error);
    }
  },

  getStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const member = await User.findOne({
        where: { id, orgId: req.orgId, role: "staff" },
      });
      if (!member) return res.notFound("Staff member not found");
      return res.successResponse(member);
    } catch (error) {
      return res.serverError(error);
    }
  },

  getStaffAvailability: async (req, res) => {
    try {
      const { id } = req.params;
      const schedules = await StaffSchedule.findAll({
        where: { userId: id },
      });
      return res.successResponse(schedules);
    } catch (error) {
      return res.serverError(error);
    }
  },
};

module.exports = staffController;
