const { Location } = require("../../models");

const locationController = {
  listLocations: async (req, res) => {
    try {
      const locations = await Location.findAll({
        where: { orgId: req.orgId },
      });
      return res.successResponse(locations);
    } catch (error) {
      return res.serverError(error);
    }
  },

  getLocation: async (req, res) => {
    try {
      const { id } = req.params;
      const location = await Location.findOne({
        where: { id, orgId: req.orgId },
      });
      if (!location) return res.notFound("Location not found");
      return res.successResponse(location);
    } catch (error) {
      return res.serverError(error);
    }
  },
};

module.exports = locationController;
