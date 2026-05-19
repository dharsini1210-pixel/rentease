const User = require("../models/User");

const Product = require("../models/Product");

const Order = require("../models/Order");

const Maintenance = require("../models/Maintenance");

// =========================
// GET DASHBOARD STATS
// =========================
const getDashboardStats = async (
  req,
  res
) => {

  try {

    // =========================
    // TOTAL USERS
    // =========================
    const totalUsers =
      await User.countDocuments();

    // =========================
    // TOTAL PRODUCTS
    // =========================
    const totalProducts =
      await Product.countDocuments();

    // =========================
    // TOTAL ORDERS
    // =========================
    const totalOrders =
      await Order.countDocuments();

    // =========================
    // TOTAL REVENUE
    // =========================
    const orders =
      await Order.find();

    const totalRevenue =
      orders.reduce(

        (acc, item) =>

          acc + item.totalAmount,

        0
      );

    // =========================
    // PENDING DELIVERIES
    // =========================
    const pendingDeliveries =
      await Order.countDocuments({

        deliveryStatus:
          "Scheduled",
      });

    // =========================
    // MAINTENANCE REQUESTS
    // =========================
    const maintenanceRequests =
      await Maintenance.countDocuments();

    // =========================
    // RESPONSE
    // =========================
    res.json({

      totalUsers,

      totalProducts,

      totalOrders,

      totalRevenue,

      pendingDeliveries,

      maintenanceRequests,
    });

  } catch (error) {

    console.log(
      "DASHBOARD ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to fetch dashboard stats",
    });
  }
};

module.exports = {

  getDashboardStats,
};