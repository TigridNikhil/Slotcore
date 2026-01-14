const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize, Organization, User, Plan } = require("../models");
const slugify = require("../utils/slugify");

// Helper to ensure unique slug
async function generateUniqueSlug(name) {
  let slug = slugify(name);
  const originalSlug = slug;
  let count = 0;

  while (true) {
    const existing = await Organization.findOne({ where: { slug } });
    if (!existing) break;

    count++;
    slug = `${originalSlug}-${count}`;
  }
  return slug;
}

exports.registerOrganization = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      orgName,
      adminName,
      email,
      password,
      category, // e.g., 'clinic', 'salon' (optional for now)
      categoryId,
    } = req.body;

    // 1. Validation
    if (!orgName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Slug Generation
    const slug = await generateUniqueSlug(orgName);

    // 3. Find Default Plan (Free)
    const freePlan = await Plan.findOne({ where: { name: "Free" } });
    const planId = freePlan ? freePlan.id : null; // Handle case if seeds not run

    // 4. Create Organization
    const organization = await Organization.create(
      {
        name: orgName,
        slug,
        planId,
        category: category || "Other",
        categoryId: categoryId || null,
        settings: {},
      },
      { transaction: t }
    );

    // 5. Create Admin User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create(
      {
        orgId: organization.id,
        name: adminName,
        email,
        passwordHash,
        role: "admin",
      },
      { transaction: t }
    );

    await t.commit();

    // 6. Generate Token
    const token = jwt.sign(
      { userId: user.id, orgId: organization.id, role: user.role },
      process.env.JWT_SECRET || "secret_dev_key",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Organization created successfully",
      token,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        subdomain: `${organization.slug}.slotcore.com`, // Frontend hint
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    await t.rollback();
    console.error("Registration Error:", error);

    // Handle uniqueness constraint violation explicitly if needed
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error:
          "Email already exists in this organization (or globally if enforced).",
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, slug } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 1. Resolve Organization
    // If slug is provided, use it. If not, and we have req.tenant (from middleware), use that.
    let orgId = req.orgId; // From middleware if present

    if (!orgId && slug) {
      const org = await Organization.findOne({ where: { slug } });
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      orgId = org.id;
    }

    // If still no org, fails (for MVP, generic login not supported without org context)
    if (!orgId) {
      return res.status(400).json({
        error: "Organization Identifier (slug) is required for login.",
      });
    }

    // 2. Find User in Org
    const user = await User.findOne({
      where: { email, orgId },
      include: [{ model: Organization, attributes: ["slug", "name"] }],
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4. Generate Token
    const token = jwt.sign(
      { userId: user.id, orgId: user.orgId, role: user.role },
      process.env.JWT_SECRET || "secret_dev_key",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        slug: user.Organization?.slug, // Return slug
        orgName: user.Organization?.name,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
