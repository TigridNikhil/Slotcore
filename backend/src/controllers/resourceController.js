const { Resource, ServiceResource } = require("../models");

exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      where: { orgId: req.tenant.id },
      order: [["name", "ASC"]],
    });
    res.successResponse(resources);
  } catch (error) {
    console.error("Get Resources Error:", error);
    res.serverError(error.message, "Failed to fetch resources");
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
    res.status(201).successResponse(resource);
  } catch (error) {
    console.error("Create Resource Error:", error);
    res.serverError(error.message, "Failed to create resource");
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, quantity } = req.body;
    const resource = await Resource.findOne({
      where: { id, orgId: req.tenant.id },
    });

    if (!resource) return res.notFound("Resource not found");

    resource.name = name;
    resource.type = type;
    resource.quantity = quantity;
    await resource.save();

    res.successResponse(resource);
  } catch (error) {
    console.error("Update Resource Error:", error);
    res.serverError(error.message, "Failed to update resource");
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findOne({
      where: { id, orgId: req.tenant.id },
    });

    if (!resource) return res.notFound("Resource not found");

    // Check if in use?
    // Optional: Prevent delete if ServiceResource links exist
    const inUse = await ServiceResource.count({ where: { resourceId: id } });
    if (inUse > 0) {
      return res.badRequest("Resource is in use by services");
    }

    await resource.destroy();
    res.successResponse(null, "Resource deleted");
  } catch (error) {
    console.error("Delete Resource Error:", error);
    res.serverError(error.message, "Failed to delete resource");
  }
};
