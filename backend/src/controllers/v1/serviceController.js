const { Service } = require("../../models");

const serviceController = {
  listServices: async (req, res) => {
    try {
      const services = await Service.findAll({
        where: { orgId: req.orgId },
        order: [["name", "ASC"]],
      });
      return res.successResponse(services);
    } catch (error) {
      return res.serverError(error);
    }
  },

  getService: async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findOne({
        where: { id, orgId: req.orgId },
      });
      if (!service) return res.notFound("Service not found");
      return res.successResponse(service);
    } catch (error) {
      return res.serverError(error);
    }
  },

  createService: async (req, res) => {
    try {
      const service = await Service.create({
        ...req.body,
        orgId: req.orgId,
      });
      return res.successResponse(service, "Service created successfully");
    } catch (error) {
      return res.serverError(error);
    }
  },

  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await Service.update(req.body, {
        where: { id, orgId: req.orgId },
      });
      if (!updated) return res.notFound("Service not found");
      const service = await Service.findByPk(id);
      return res.successResponse(service, "Service updated successfully");
    } catch (error) {
      return res.serverError(error);
    }
  },

  deleteService: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Service.destroy({
        where: { id, orgId: req.orgId },
      });
      if (!deleted) return res.notFound("Service not found");
      return res.successResponse(null, "Service deleted successfully");
    } catch (error) {
      return res.serverError(error);
    }
  },
};

module.exports = serviceController;
