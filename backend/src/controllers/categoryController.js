const { Category } = require("../models");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    });
    res.successResponse(categories);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Failed to fetch categories");
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, icon, description, sortOrder } = req.body;
    const category = await Category.create({
      name,
      slug,
      icon,
      description,
      sortOrder,
    });
    res.status(201).successResponse(category);
  } catch (error) {
    console.error(error);
    res.badRequest(error.message, "Failed to create category");
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    await category.update(req.body);
    res.successResponse(category);
  } catch (error) {
    res.badRequest(error.message, "Failed to update category");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Optional: Check if associated organizations exist before deleting
    // For now, simpler delete
    await category.destroy();
    res.successResponse(null, "Category deleted");
  } catch (error) {
    res.serverError(error.message, "Failed to delete category");
  }
};
