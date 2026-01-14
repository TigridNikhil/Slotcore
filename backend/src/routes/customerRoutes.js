const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

// All routes require auth (Admin/OrgAdmin/Staff usually)
// Staff should be able to view/edit customers? Yes.
router.use(auth);
router.use(authorize(["admin", "org_admin", "staff"]));

router.get("/", customerController.listCustomers);
router.get("/:id", customerController.getCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer); // Maybe admin only? allow all for now.

module.exports = router;
