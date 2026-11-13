const express = require("express");
const admin = require("../controllers/adminController");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

// Everything here is for admins.
router.use(requireRole("admin"));

router.get("/audit", admin.auditLog);
router.get("/accounts", admin.accounts);
router.post("/accounts/:id/role", admin.setRole);

module.exports = router;
