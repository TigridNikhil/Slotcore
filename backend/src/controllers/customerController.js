const { Customer, Booking, Service } = require("../models");
const { Op } = require("sequelize");

// List Customers (Search, Sort, Pagination)
exports.listCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { orgId: req.orgId };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await Customer.findAndCountAll({
      where: whereClause,
      order: [["updatedAt", "DESC"]], // Recently active first
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      customers: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("List Customers Error:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// Get Single Customer with History
exports.getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({
      where: { id, orgId: req.orgId },
      include: [
        {
          model: Booking,
          as: "bookings",
          attributes: ["id", "startTime", "status", "customerId"],
          include: [{ model: Service, attributes: ["name", "price"] }],
          limit: 10,
          order: [["startTime", "DESC"]],
        },
      ],
    });

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    res.json(customer);
  } catch (error) {
    console.error("Get Customer Error:", error);
    res.status(500).json({ error: "Failed to fetch details" });
  }
};

// Update Customer (Notes, Tags, Info)
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, notes, tags } = req.body;

    const customer = await Customer.findOne({
      where: { id, orgId: req.orgId },
    });

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // Validate email uniqueness if changing?
    // For now, trust input or handle DB unique constraint error if we added one (we didn't yet).

    await customer.update({
      name,
      email,
      mobile,
      notes,
      tags: tags || customer.tags, // Array
    });

    res.json(customer);
  } catch (error) {
    console.error("Update Customer Error:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({
      where: { id, orgId: req.orgId },
    });

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    await customer.destroy();
    res.json({ success: true, message: "Customer deleted" });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
};
