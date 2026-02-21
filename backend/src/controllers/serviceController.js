const { Service, ServicePricing } = require("../models");

// GET /api/services
exports.listServices = async (req, res) => {
  try {
    if (!req.orgId) {
      return res.badRequest(
        null,
        "Tenant context required (subdomain or x-tenant-slug)",
      );
    }

    const services = await Service.findAll({
      where: { orgId: req.orgId },
      include: [
        {
          association: "staff",
          attributes: ["id", "name", "email", "title"],
          through: { attributes: [] }, // Hide junction table
        },
        {
          association: "locations",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
        {
          association: "resources",
          attributes: ["id", "name", "type", "quantity"],
          through: { attributes: ["quantityRequired"] },
        },
        { model: ServicePricing },
      ],
      order: [["name", "ASC"]],
    });
    res.successResponse(services);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Server error fetching services");
  }
};

// POST /api/services
exports.createService = async (req, res) => {
  try {
    // Role check (can also be middleware)
    if (
      req.user.role !== "admin" &&
      req.user.role !== "org_admin" &&
      req.user.role !== "super_admin"
    ) {
      return res.forbidden(null, "Only admins can create services");
    }

    const {
      name,
      description,
      durationMin,
      price,
      isActive,
      bufferTime,
      capacity,
      maxBookingsPerDay,
      staffIds,
    } = req.body;

    if (!name || !durationMin) {
      return res.badRequest("Name and duration are required");
    }

    const service = await Service.create({
      orgId: req.orgId,
      name,
      description,
      durationMin,
      price,
      isActive,
      bufferTime: bufferTime || 0,
      capacity: capacity || 1,
      maxBookingsPerDay: maxBookingsPerDay || null,
    });

    if (staffIds && Array.isArray(staffIds)) {
      await service.setStaff(staffIds);
    }

    // Handle Locations
    const { locationIds, resourceIds } = req.body;
    if (locationIds && Array.isArray(locationIds)) {
      await service.setLocations(locationIds);
    }

    // Handle Resources
    if (resourceIds && Array.isArray(resourceIds)) {
      await service.setResources(resourceIds);
    }

    // Handle Pricing Strategy (Default)
    const { paymentType, advanceAmount } = req.body;
    let defaultPaymentType = "FULL";
    if (parseFloat(price) === 0) defaultPaymentType = "FREE";
    if (paymentType) defaultPaymentType = paymentType;

    await ServicePricing.create({
      serviceId: service.id,
      locationId: null, // Default
      paymentType: defaultPaymentType,
      price: price || 0,
      advanceAmount: advanceAmount || 0,
      currency: "INR",
    });

    // Reload to return with staff included
    const serviceWithStaff = await Service.findByPk(service.id, {
      include: [
        { association: "staff", attributes: ["id", "name"] },
        { association: "locations", attributes: ["id", "name"] },
        { association: "resources", attributes: ["id", "name"] },
        { model: ServicePricing },
      ],
    });

    res.status(201).successResponse(serviceWithStaff);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Server error creating service");
  }
};

// PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    if (
      req.user.role !== "admin" &&
      req.user.role !== "org_admin" &&
      req.user.role !== "super_admin"
    ) {
      return res.forbidden(null, "Only admins can update services");
    }

    const { id } = req.params;
    const {
      name,
      description,
      durationMin,
      price,
      isActive,
      bufferTime,
      capacity,
      maxBookingsPerDay,
      staffIds,
    } = req.body;

    const service = await Service.findOne({
      where: { id, orgId: req.orgId },
    });

    if (!service) {
      return res.notFound("Service not found");
    }

    await service.update({
      name,
      description,
      durationMin: durationMin || 0,
      price,
      isActive,
      bufferTime: bufferTime === "" ? 0 : bufferTime,
      capacity: capacity === "" ? 1 : capacity,
      maxBookingsPerDay: maxBookingsPerDay === "" ? null : maxBookingsPerDay,
    });

    if (staffIds && Array.isArray(staffIds)) {
      await service.setStaff(staffIds);
    }

    // Handle Locations
    const { locationIds, resourceIds } = req.body;
    if (locationIds && Array.isArray(locationIds)) {
      await service.setLocations(locationIds);
    }

    // Handle Resources
    if (resourceIds && Array.isArray(resourceIds)) {
      await service.setResources(resourceIds);
    }

    // Handle Pricing Strategy Update
    const { paymentType, advanceAmount } = req.body;
    if (paymentType !== undefined || price !== undefined) {
      const pricingRecord = await ServicePricing.findOne({
        where: { serviceId: service.id, locationId: null },
      });

      if (pricingRecord) {
        await pricingRecord.update({
          paymentType: paymentType || pricingRecord.paymentType,
          price: price !== undefined ? price : pricingRecord.price,
          advanceAmount:
            advanceAmount !== undefined
              ? advanceAmount
              : pricingRecord.advanceAmount,
        });
      } else {
        let defaultType = "FULL";
        if (parseFloat(price || service.price) === 0 && !paymentType)
          defaultType = "FREE";

        await ServicePricing.create({
          serviceId: service.id,
          locationId: null,
          paymentType: paymentType || defaultType,
          price: price !== undefined ? price : service.price,
          advanceAmount: advanceAmount || 0,
          currency: "INR",
        });
      }
    }

    const updatedService = await Service.findByPk(service.id, {
      include: [
        { association: "staff", attributes: ["id", "name"] },
        { association: "locations", attributes: ["id", "name"] },
        { association: "resources", attributes: ["id", "name"] },
        { model: ServicePricing },
      ],
    });

    res.successResponse(updatedService);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Server error updating service");
  }
};

// DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.forbidden(null, "Only admins can delete services");
    }

    const { id } = req.params;
    const deleted = await Service.destroy({
      where: { id, orgId: req.orgId },
    });

    if (!deleted) {
      return res.notFound("Service not found");
    }

    res.successResponse(null, "Service deleted successfully");
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Server error deleting service");
  }
};
