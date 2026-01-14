"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          id: uuidv4(),
          name: "Health & Wellness",
          slug: "health-wellness",
          icon: "FaHeartbeat",
          description:
            "Clinics, diagnostics, therapy, fitness and wellness services",
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Beauty & Grooming",
          slug: "beauty-grooming",
          icon: "FaScissors",
          description:
            "Salon, spa, grooming and personal care services",
          isActive: true,
          sortOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Professional Services",
          slug: "professional-services",
          icon: "FaBriefcase",
          description:
            "Consultations, legal, accounting and business services",
          isActive: true,
          sortOrder: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Education & Training",
          slug: "education-training",
          icon: "FaGraduationCap",
          description:
            "Coaching, tuition, training sessions and workshops",
          isActive: true,
          sortOrder: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Home Services",
          slug: "home-services",
          icon: "FaHome",
          description:
            "Repairs, cleaning, maintenance and home-related services",
          isActive: true,
          sortOrder: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Automobile Services",
          slug: "automobile-services",
          icon: "FaCar",
          description:
            "Car service, bike service, inspections and repairs",
          isActive: true,
          sortOrder: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Events & Photography",
          slug: "events-photography",
          icon: "FaCamera",
          description:
            "Event planning, photography and videography services",
          isActive: true,
          sortOrder: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "IT & Digital Services",
          slug: "it-digital-services",
          icon: "FaCode",
          description:
            "Web development, design, digital marketing and IT support",
          isActive: true,
          sortOrder: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
