const express = require("express");

const router = express.Router();

const {

  placeOrder,

  getMyOrders,

  getAllOrders,

  getProductRentalDetails,

  updateOrderStatus,

  updateDeliveryStatus,

  requestPickup,

  updatePickupStatus,

  renewRental,

  // =========================
  // ANALYTICS
  // =========================
  getMonthlyStatement,

  getDailyCustomers,

  getTopProducts,

  searchCustomerOrders,

  getRegularCustomers

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
// PRODUCT RENTAL ANALYTICS
// =========================
router.get(
  "/product-analytics/:productName",
  protect,
  getProductRentalDetails
);

// =========================
// MONTHLY STATEMENT
// =========================
router.get(
  "/admin/monthly-statement",
  protect,
  getMonthlyStatement
);

// =========================
// DAILY CUSTOMERS
// =========================
router.get(
  "/admin/daily-customers",
  protect,
  getDailyCustomers
);

// =========================
// TOP PRODUCTS
// =========================
router.get(
  "/admin/top-products",
  protect,
  getTopProducts
);

// =========================
// SEARCH CUSTOMER
// =========================
router.get(
  "/admin/customer-search",
  protect,
  searchCustomerOrders
);

// =========================
// REGULAR CUSTOMERS
// =========================
router.get(
  "/admin/regular-customers",
  protect,
  getRegularCustomers
);

// =========================
// RENEW RENTAL
// =========================
router.put(
  "/:id/renew",
  protect,
  renewRental
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