const express = require("express");

const router = express.Router();

const {

  placeOrder,

  getMyOrders,

  getAllOrders,

  updateOrderStatus,

  updateDeliveryStatus,

  requestPickup,

  updatePickupStatus

} = require(
  "../controllers/orderController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

// =========================
// PLACE ORDER
// =========================
router.post(
  "/",
  protect,
  placeOrder
);

// =========================
// GET MY ORDERS
// =========================
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// =========================
// ADMIN GET ALL ORDERS
// =========================
router.get(
  "/",
  protect,
  getAllOrders
);

// =========================
// UPDATE ORDER STATUS
// =========================
router.put(
  "/:id/status",
  protect,
  updateOrderStatus
);

// =========================
// UPDATE DELIVERY STATUS
// =========================
router.put(
  "/:id/delivery-status",
  protect,
  updateDeliveryStatus
);

// =========================
// REQUEST PICKUP
// =========================
router.put(
  "/:id/request-pickup",
  protect,
  requestPickup
);

// =========================
// UPDATE PICKUP STATUS
// =========================
router.put(
  "/:id/pickup-status",
  protect,
  updatePickupStatus
);

module.exports = router;