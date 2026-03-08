const { Customer } = require("../../models");

const customerController = {
  listCustomers: async (req, res) => {
    try {
      const customers = await Customer.findAll({
        where: { orgId: req.orgId },
        order: [["name", "ASC"]],
      });
      return res.successResponse(customers);
    } catch (error) {
      return res.serverError(error);
    }
  },

  getCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findOne({
        where: { id, orgId: req.orgId },
      });
      if (!customer) return res.notFound("Customer not found");
      return res.successResponse(customer);
    } catch (error) {
      return res.serverError(error);
    }
  },

  createOrUpdateCustomer: async (req, res) => {
    try {
      const { email, name, mobile } = req.body;
      if (!email) return res.badRequest("Email is required");

      const [customer, created] = await Customer.findOrCreate({
        where: { email, orgId: req.orgId },
        defaults: { name, mobile, orgId: req.orgId },
      });

      if (!created) {
        if (name) customer.name = name;
        if (mobile) customer.mobile = mobile;
        await customer.save();
      }

      return res.successResponse(
        customer,
        created ? "Customer created" : "Customer updated",
      );
    } catch (error) {
      return res.serverError(error);
    }
  },
};

module.exports = customerController;
