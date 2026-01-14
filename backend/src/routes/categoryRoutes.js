const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

// Public
router.get("/", controller.getAllCategories);

// Admin Only
router.post("/", auth, authorize(["super_admin"]), controller.createCategory);
router.put("/:id", auth, authorize(["super_admin"]), controller.updateCategory);
router.delete(
  "/:id",
  auth,
  authorize(["super_admin"]),
  controller.deleteCategory
);

module.exports = router;
