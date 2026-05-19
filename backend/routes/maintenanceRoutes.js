const express = require("express");

const router = express.Router();

const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
} = require(
  "../controllers/maintenanceController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// =========================
// USER CREATE REQUEST
// =========================
router.post(
  "/",
  protect,
  createRequest
);

// =========================
// USER GET MY REQUESTS
// =========================
router.get(
  "/my-requests",
  protect,
  getMyRequests
);

// =========================
// ADMIN GET ALL REQUESTS
// =========================
router.get(
  "/",
  protect,
  getAllRequests
);

// =========================
// ADMIN UPDATE STATUS
// =========================
router.put(
  "/:id",
  protect,
  updateRequestStatus
);

module.exports = router;