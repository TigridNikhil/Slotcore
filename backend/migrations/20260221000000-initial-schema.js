"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Categories
    await queryInterface.createTable("Categories", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      icon: { type: Sequelize.STRING, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      sortOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 2. Plans
    await queryInterface.createTable("Plans", {
      key: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      priceMonthly: { type: Sequelize.FLOAT, defaultValue: 0 },
      priceYearly: { type: Sequelize.FLOAT, defaultValue: 0 },
      limits: { type: Sequelize.JSONB, defaultValue: {} },
      features: { type: Sequelize.JSONB, defaultValue: [] },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 3. Organizations
    await queryInterface.createTable("Organizations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      logoUrl: { type: Sequelize.STRING, allowNull: true },
      primaryColor: { type: Sequelize.STRING, defaultValue: "#4F46E5" },
      settings: { type: Sequelize.JSONB, defaultValue: {} },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      contactEmail: { type: Sequelize.STRING, allowNull: true },
      contactPhone: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.STRING, allowNull: true },
      content: { type: Sequelize.JSONB, defaultValue: {} },
      cancellationWindowHr: { type: Sequelize.INTEGER, defaultValue: 24 },
      refundPolicy: {
        type: Sequelize.TEXT,
        defaultValue: "Refunds are processed manually.",
      },
      plan: { type: Sequelize.STRING, defaultValue: "STARTER" },
      billingCycle: { type: Sequelize.STRING, defaultValue: "MONTHLY" },
      subscriptionStatus: { type: Sequelize.STRING, defaultValue: "ACTIVE" },
      featureFlags: { type: Sequelize.JSONB, defaultValue: {} },
      limits: { type: Sequelize.JSONB, defaultValue: {} },
      isMarketplaceVisible: { type: Sequelize.BOOLEAN, defaultValue: false },
      marketplaceRank: { type: Sequelize.INTEGER, defaultValue: 0 },
      marketplaceTag: { type: Sequelize.STRING, defaultValue: "NONE" },
      category: { type: Sequelize.STRING, defaultValue: "Other" },
      categoryId: {
        type: Sequelize.UUID,
        references: { model: "Categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      subCategory: { type: Sequelize.STRING, allowNull: true },
      averageRating: { type: Sequelize.FLOAT, defaultValue: 0 },
      totalReviews: { type: Sequelize.INTEGER, defaultValue: 0 },
      ownerId: { type: Sequelize.UUID, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 4. Users
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      email: { type: Sequelize.STRING, allowNull: false },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING },
      role: { type: Sequelize.STRING, defaultValue: "org_admin" },
      title: { type: Sequelize.STRING, allowNull: true },
      otp: { type: Sequelize.STRING, allowNull: true },
      otpExpiresAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Link Organization owner
    await queryInterface.changeColumn("Organizations", "ownerId", {
      type: Sequelize.UUID,
      references: { model: "Users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // 5. Locations
    await queryInterface.createTable("Locations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      name: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING },
      timezone: { type: Sequelize.STRING, defaultValue: "UTC" },
      contactEmail: { type: Sequelize.STRING },
      contactPhone: { type: Sequelize.STRING },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 6. Resources
    await queryInterface.createTable("Resources", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, defaultValue: "asset" },
      quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 7. Services
    await queryInterface.createTable("Services", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      durationMin: { type: Sequelize.INTEGER, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      bufferTime: { type: Sequelize.INTEGER, defaultValue: 0 },
      capacity: { type: Sequelize.INTEGER, defaultValue: 1 },
      maxBookingsPerDay: { type: Sequelize.INTEGER, allowNull: true },
      availabilityRules: { type: Sequelize.JSONB, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 8. Customers
    await queryInterface.createTable("Customers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING },
      name: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 9. Bookings
    await queryInterface.createTable("Bookings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      serviceId: {
        type: Sequelize.UUID,
        references: { model: "Services", key: "id" },
        onDelete: "SET NULL",
      },
      customerId: {
        type: Sequelize.UUID,
        references: { model: "Customers", key: "id" },
        onDelete: "SET NULL",
      },
      staffId: {
        type: Sequelize.UUID,
        references: { model: "Users", key: "id" },
        onDelete: "SET NULL",
      },
      locationId: {
        type: Sequelize.UUID,
        references: { model: "Locations", key: "id" },
        onDelete: "SET NULL",
      },
      startTime: { type: Sequelize.DATE, allowNull: false },
      endTime: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.STRING, defaultValue: "pending" },
      notes: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 10. Payments
    await queryInterface.createTable("Payments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      bookingId: {
        type: Sequelize.UUID,
        references: { model: "Bookings", key: "id" },
        onDelete: "CASCADE",
      },
      orderId: { type: Sequelize.STRING, allowNull: false, unique: true },
      paymentId: { type: Sequelize.STRING },
      signature: { type: Sequelize.STRING },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      currency: { type: Sequelize.STRING, defaultValue: "INR" },
      status: { type: Sequelize.STRING, defaultValue: "created" },
      method: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 11. Reviews
    await queryInterface.createTable("Reviews", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      bookingId: {
        type: Sequelize.UUID,
        unique: true,
        references: { model: "Bookings", key: "id" },
        onDelete: "CASCADE",
      },
      organizationId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT },
      reviewerName: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING, defaultValue: "PENDING" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 12. Schedules
    await queryInterface.createTable("Schedules", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      locationId: {
        type: Sequelize.UUID,
        references: { model: "Locations", key: "id" },
        onDelete: "CASCADE",
      },
      dayOfWeek: { type: Sequelize.INTEGER, allowNull: false },
      startTime: { type: Sequelize.TIME, defaultValue: "09:00:00" },
      endTime: { type: Sequelize.TIME, defaultValue: "17:00:00" },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      breakStartTime: { type: Sequelize.TIME },
      breakEndTime: { type: Sequelize.TIME },
      isBreakActive: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 13. AvailabilityOverrides
    await queryInterface.createTable("AvailabilityOverrides", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      date: { type: Sequelize.DATE, allowNull: false },
      startTime: { type: Sequelize.TIME },
      endTime: { type: Sequelize.TIME },
      isOff: { type: Sequelize.BOOLEAN, defaultValue: false },
      serviceId: { type: Sequelize.UUID },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 14. StaffSchedules
    await queryInterface.createTable("StaffSchedules", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      dayOfWeek: { type: Sequelize.INTEGER, allowNull: false },
      startTime: { type: Sequelize.TIME, defaultValue: "09:00" },
      endTime: { type: Sequelize.TIME, defaultValue: "17:00" },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      breakStartTime: { type: Sequelize.TIME },
      breakEndTime: { type: Sequelize.TIME },
      isBreakActive: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 15. AuditLogs
    await queryInterface.createTable("AuditLogs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: { type: Sequelize.UUID, allowNull: false },
      entityId: { type: Sequelize.UUID, allowNull: false },
      entityType: { type: Sequelize.STRING, allowNull: false },
      action: { type: Sequelize.STRING, allowNull: false },
      performedBy: { type: Sequelize.UUID },
      performedByEmail: { type: Sequelize.STRING },
      ipAddress: { type: Sequelize.STRING },
      changes: { type: Sequelize.JSONB },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 16. Integrations
    await queryInterface.createTable("Integrations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: { type: Sequelize.UUID, allowNull: false },
      provider: { type: Sequelize.STRING, allowNull: false },
      credentials: { type: Sequelize.JSON },
      settings: {
        type: Sequelize.JSON,
        defaultValue: { syncDirection: "both" },
      },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      lastSyncAt: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 17. OrgNotificationSettings
    await queryInterface.createTable("OrgNotificationSettings", {
      orgId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      enableSMS: { type: Sequelize.BOOLEAN, defaultValue: false },
      enableWhatsApp: { type: Sequelize.BOOLEAN, defaultValue: false },
      senderId: { type: Sequelize.STRING },
      whatsappTemplateId: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 18. VendorLedgers
    await queryInterface.createTable("VendorLedgers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      bookingId: {
        type: Sequelize.UUID,
        references: { model: "Bookings", key: "id" },
      },
      grossAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      platformCommission: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      netAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      paymentMode: { type: Sequelize.STRING, defaultValue: "ONLINE" },
      settlementDirection: {
        type: Sequelize.STRING,
        defaultValue: "PLATFORM_PAYS_VENDOR",
      },
      status: { type: Sequelize.STRING, defaultValue: "UNSETTLED" },
      settledAt: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 19. PlatformCommissions
    await queryInterface.createTable("PlatformCommissions", {
      orgId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      commissionType: { type: Sequelize.STRING, defaultValue: "PERCENTAGE" },
      commissionValue: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 10.0,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 20. MarketplaceStats
    await queryInterface.createTable("MarketplaceStats", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: { type: Sequelize.UUID, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      views: { type: Sequelize.INTEGER, defaultValue: 0 },
      clicks: { type: Sequelize.INTEGER, defaultValue: 0 },
      redirects: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 21. PageSections
    await queryInterface.createTable("PageSections", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      orgId: {
        type: Sequelize.UUID,
        references: { model: "Organizations", key: "id" },
        onDelete: "CASCADE",
      },
      pageName: { type: Sequelize.STRING, defaultValue: "home" },
      sectionType: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.JSONB, defaultValue: {}, allowNull: false },
      displayOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 22. Consumers
    await queryInterface.createTable("Consumers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      mobile: { type: Sequelize.STRING, unique: true },
      name: { type: Sequelize.STRING },
      otp: { type: Sequelize.STRING },
      otpExpiresAt: { type: Sequelize.DATE },
      isVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 23. ServicePricing
    await queryInterface.createTable("ServicePricing", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      serviceId: {
        type: Sequelize.UUID,
        references: { model: "Services", key: "id" },
        onDelete: "CASCADE",
      },
      locationId: {
        type: Sequelize.UUID,
        references: { model: "Locations", key: "id" },
        onDelete: "CASCADE",
      },
      paymentType: { type: Sequelize.STRING, defaultValue: "FULL" },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      advanceAmount: { type: Sequelize.DECIMAL(10, 2) },
      currency: { type: Sequelize.STRING, defaultValue: "INR" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 24. ServiceResource
    await queryInterface.createTable("ServiceResource", {
      serviceId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: "Services", key: "id" },
        onDelete: "CASCADE",
      },
      resourceId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: "Resources", key: "id" },
        onDelete: "CASCADE",
      },
      quantityRequired: { type: Sequelize.INTEGER, defaultValue: 1 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Junctions
    await queryInterface.createTable("ServiceStaff", {
      serviceId: {
        type: Sequelize.UUID,
        references: { model: "Services", key: "id" },
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("ServiceLocation", {
      serviceId: {
        type: Sequelize.UUID,
        references: { model: "Services", key: "id" },
        onDelete: "CASCADE",
      },
      locationId: {
        type: Sequelize.UUID,
        references: { model: "Locations", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("UserLocation", {
      userId: {
        type: Sequelize.UUID,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      locationId: {
        type: Sequelize.UUID,
        references: { model: "Locations", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserLocation");
    await queryInterface.dropTable("ServiceLocation");
    await queryInterface.dropTable("ServiceStaff");
    await queryInterface.dropTable("ServiceResource");
    await queryInterface.dropTable("ServicePricing");
    await queryInterface.dropTable("Consumers");
    await queryInterface.dropTable("PageSections");
    await queryInterface.dropTable("MarketplaceStats");
    await queryInterface.dropTable("PlatformCommissions");
    await queryInterface.dropTable("VendorLedgers");
    await queryInterface.dropTable("OrgNotificationSettings");
    await queryInterface.dropTable("Integrations");
    await queryInterface.dropTable("AuditLogs");
    await queryInterface.dropTable("StaffSchedules");
    await queryInterface.dropTable("AvailabilityOverrides");
    await queryInterface.dropTable("Schedules");
    await queryInterface.dropTable("Reviews");
    await queryInterface.dropTable("Payments");
    await queryInterface.dropTable("Bookings");
    await queryInterface.dropTable("Customers");
    await queryInterface.dropTable("Services");
    await queryInterface.dropTable("Resources");
    await queryInterface.dropTable("Locations");
    await queryInterface.dropTable("Users");
    await queryInterface.dropTable("Organizations");
    await queryInterface.dropTable("Plans");
    await queryInterface.dropTable("Categories");
  },
};
