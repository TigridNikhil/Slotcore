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
      return res.badRequest("Missing required fields");
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
        subscriptionStatus: "TRIAL",
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { transaction: t },
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
      { transaction: t },
    );

    await t.commit();

    const accesstoken = jwt.sign(
      { userId: user.id, orgId: organization.id, role: user.role },
      process.env.JWT_SECRET || "secret_dev_key",
      { expiresIn: "1d" },
    );

    const refreshtoken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || "refresh_secret_dev_key",
      { expiresIn: "7d" },
    );

    res.status(201).successResponse(
      {
        accesstoken,
        refreshtoken,
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          subdomain: `${organization.slug}.slotcore.com`, // Frontend hint
          onboardingCompleted: organization?.onboardingCompleted,
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          onboardingCompleted: organization?.onboardingCompleted,
          orgName: organization?.name,
        },
      },
      "Organization created successfully",
    );
  } catch (error) {
    await t.rollback();
    console.error("Registration Error:", error);

    // Handle uniqueness constraint violation explicitly if needed
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        error:
          "Email already exists in this organization (or globally if enforced).",
      });
    }

    res.serverError(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, slug } = req.body;

    if (!email || !password) {
      return res.badRequest("Email and password are required");
    }

    // 1. Resolve Organization
    // If slug is provided, use it. If not, and we have req.tenant (from middleware), use that.
    let orgId = req.orgId; // From middleware if present

    if (!orgId && slug) {
      const org = await Organization.findOne({ where: { slug } });
      if (!org) {
        return res.notFound("Organization not found");
      }
      orgId = org.id;
    }

    // If still no org, fails (for MVP, generic login not supported without org context)
    if (!orgId) {
      return res.badRequest(
        null,
        "Organization Identifier (slug) is required for login.",
      );
    }

    // 2. Find User in Org
    const user = await User.findOne({
      where: { email, orgId },
      include: [
        {
          model: Organization,
          attributes: ["slug", "name", "onboardingCompleted"],
        },
      ],
    });
    if (!user) {
      return res.badRequest("Invalid credentials");
    }

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.badRequest("Invalid credentials");
    }

    // 4. Generate Tokens
    const accesstoken = jwt.sign(
      {
        userId: user.id,
        orgId: user.orgId,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET || "secret_dev_key",
      { expiresIn: "1d" },
    );

    const refreshtoken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || "refresh_secret_dev_key",
      { expiresIn: "7d" },
    );

    res.successResponse(
      {
        accesstoken,
        refreshtoken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          orgId: user.orgId,
          slug: user.Organization?.slug, // Return slug
          onboardingCompleted: user.Organization?.onboardingCompleted,
          orgName: user.Organization?.name,
        },
      },
      "Login successful",
    );
  } catch (error) {
    console.error("Login Error:", error);
    res.serverError(error.message);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.unauthorized(null, "Refresh token is required");
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refresh_secret_dev_key",
    );

    // Find user
    const user = await User.findByPk(decoded.userId, {
      include: [{ model: Organization, attributes: ["id", "slug", "name"] }],
    });

    if (!user) {
      return res.unauthorized(null, "User not found or inactive");
    }

    // Generate new access token
    const accesstoken = jwt.sign(
      {
        userId: user.id,
        orgId: user.orgId,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET || "secret_dev_key",
      { expiresIn: "1h" }, // Access token short-lived
    );

    // Generate new refresh token (Rotate)
    const refreshtoken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || "refresh_secret_dev_key",
      { expiresIn: "7d" },
    );

    res.successResponse({
      accesstoken,
      refreshtoken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.unauthorized(null, "Invalid or expired refresh token");
  }
};

exports.forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.badRequest("Email is required");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // For security, don't confirm if user exists or not
      return res.successResponse(
        null,
        "If an account exists with this email, you will receive an OTP.",
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    const emailService = require("../services/emailService");
    const sent = await emailService.sendForgotPasswordOtp(email, otp);

    if (!sent) {
      return res.serverError(null, "Failed to send reset email");
    }

    res.successResponse(
      null,
      "If an account exists with this email, you will receive an OTP.",
    );
  } catch (error) {
    console.error("Forgot Password Request Error:", error);
    res.serverError(error.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.badRequest("Email, OTP and new password are required");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.notFound("User not found");
    }

    if (user.otp !== otp || new Date() > user.otpExpiresAt) {
      return res.unauthorized(null, "Invalid or expired OTP");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.passwordHash = passwordHash;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.successResponse(null, "Password reset successful. You can now login.");
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.serverError(error.message);
  }
};
