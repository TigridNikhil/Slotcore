const { Resource, ServiceResource } = require("../models");

exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      where: { orgId: req.tenant.id },
      order: [["name", "ASC"]],
    });
    res.json(resources);
  } catch (error) {
    console.error("Get Resources Error:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { name, type, quantity } = req.body;
    const resource = await Resource.create({
      orgId: req.tenant.id,
      name,
      type,
      quantity,
    });
    res.status(201).json(resource);
  } catch (error) {
    console.error("Create Resource Error:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, quantity } = req.body;
    const resource = await Resource.findOne({
      where: { id, orgId: req.tenant.id },
    });

    if (!resource) return res.status(404).json({ error: "Resource not found" });

    resource.name = name;
    resource.type = type;
    resource.quantity = quantity;
    await resource.save();

    res.json(resource);
  } catch (error) {
    console.error("Update Resource Error:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findOne({
      where: { id, orgId: req.tenant.id },
    });

    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // Check if in use?
    // Optional: Prevent delete if ServiceResource links exist
    const inUse = await ServiceResource.count({ where: { resourceId: id } });
    if (inUse > 0) {
      return res.status(400).json({ error: "Resource is in use by services" });
    }

    await resource.destroy();
    res.json({ message: "Resource deleted" });
  } catch (error) {
    console.error("Delete Resource Error:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
};
