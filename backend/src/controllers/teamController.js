const { User, Organization } = require("../models");
const bcrypt = require("bcryptjs"); // Ensure bcryptjs is installed or use existing auth util
const emailService = require("../services/emailService");

// GET /api/organization/team
exports.getTeamMembers = async (req, res) => {
  try {
    const members = await User.findAll({
      where: { orgId: req.orgId },
      attributes: { exclude: ["passwordHash"] },
      order: [["name", "ASC"]],
    });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
};

// POST /api/organization/team (Invite/Add)
exports.addTeamMember = async (req, res) => {
  try {
    const { name, email, role, title, password } = req.body;

    // Check existing
    const existing = await User.findOne({
      where: { email, orgId: req.orgId },
    });
    if (existing) {
      return res
        .status(400)
        .json({ error: "User already exists in this organization" });
    }

    // Hash password (if provided, else generate random for invite flow - simplifying to required for now or default)
    const initialPassword = password || "123456"; // Default for MVP/Demo
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(initialPassword, salt);

    const newUser = await User.create({
      orgId: req.orgId,
      name,
      email,
      role: role || "staff",
      title,
      passwordHash,
    });

    // Remove hash from response
    const { passwordHash: _, ...userWithoutPass } = newUser.toJSON();

    // Fetch Org Name for email
    const org = await Organization.findByPk(req.orgId);

    // Send email invitation with credentials
    emailService
      .sendTeamInvitation(newUser, initialPassword, org.name)
      .catch((err) => console.error("Failed to send invitation email:", err));

    res.status(201).json(userWithoutPass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add team member" });
  }
};

// PUT /api/organization/team/:userId
exports.updateTeamMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, role, title } = req.body;

    const user = await User.findOne({
      where: { id: userId, orgId: req.orgId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ name, role, title });

    const { passwordHash: _, ...userWithoutPass } = user.toJSON();
    res.json(userWithoutPass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update member" });
  }
};

// DELETE /api/organization/team/:userId
exports.removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting self?
    if (userId === req.user.id) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }

    const user = await User.findOne({
      where: { id: userId, orgId: req.orgId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Actually delete or soft delete? Destroy for now.
    await user.destroy();

    res.json({ success: true, message: "Member removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};
