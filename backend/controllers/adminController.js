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
    // GET ALL ORDERS
    // =========================
    const orders =
      await Order.find();

    // =========================
    // TOTAL REVENUE
    // =========================
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
    // MONTH-WISE ANALYTICS
    // =========================
    const monthlyStats = {};

    orders.forEach((order) => {

      const date =
        new Date(order.createdAt);

      const month =
        date.toLocaleString(
          "default",
          {
            month: "short",
          }
        );

      if (!monthlyStats[month]) {

        monthlyStats[month] = {

          orders: 0,

          revenue: 0,
        };
      }

      monthlyStats[month].orders += 1;

      monthlyStats[month].revenue +=
        order.totalAmount;
    });

    // =========================
    // FORMAT MONTH DATA
    // =========================
    const monthlyAnalytics =
      Object.keys(monthlyStats).map(
        (month) => ({

          month,

          orders:
            monthlyStats[month]
              .orders,

          revenue:
            monthlyStats[month]
              .revenue,
        })
      );

    // =========================
    // TOP RENTED PRODUCTS
    // =========================
    const productMap = {};

    orders.forEach((order) => {

      order.items.forEach(
        (item) => {

          if (
            !productMap[item.name]
          ) {

            productMap[item.name] = 0;
          }

          productMap[item.name] +=
            item.quantity;
        }
      );
    });

    const topProducts =
      Object.keys(productMap)

        .map((name) => ({

          name,

          rentals:
            productMap[name],
        }))

        .sort(
          (a, b) =>

            b.rentals -
            a.rentals
        )

        .slice(0, 5);

    // =========================
    // MOST ACTIVE CUSTOMERS
    // =========================
    const customerMap = {};

    orders.forEach((order) => {

      const customer =
        order.customerName ||
        "Unknown";

      if (
        !customerMap[customer]
      ) {

        customerMap[customer] = 0;
      }

      customerMap[customer] += 1;
    });

    const activeCustomers =
      Object.keys(customerMap)

        .map((customer) => ({

          customer,

          orders:
            customerMap[
              customer
            ],
        }))

        .sort(
          (a, b) =>

            b.orders -
            a.orders
        )

        .slice(0, 5);

    // =========================
    // ACTIVE RENTALS
    // =========================
    const activeRentals =
      orders.filter((order) => {

        const start =
          new Date(
            order.deliveryDate
          );

        const end =
          new Date(start);

        end.setMonth(

          end.getMonth() +

          order.rentalDuration
        );

        return end > new Date();
      }).length;

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

      activeRentals,

      monthlyAnalytics,

      topProducts,

      activeCustomers,
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