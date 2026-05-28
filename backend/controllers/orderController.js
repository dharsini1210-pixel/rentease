const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");

// =========================
// EMAIL TRANSPORTER
// =========================
const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// =========================
// GENERATE INVOICE NUMBER
// =========================
const generateInvoiceNumber = () => {

  const random =
    Math.floor(
      100000 + Math.random() * 900000
    );

  return `INV-${random}`;
};

// =========================
// PLACE ORDER
// =========================
const placeOrder = async (req, res) => {

  try {

    const {
      address,
      rentalDuration,
      deliveryDate,
      deliverySlot,
      totalAmount,
      paymentStatus,
      paymentMethod,
      items,
    } = req.body;

    if (!items || items.length === 0) {

      return res.status(400).json({
        message: "No order items",
      });
    }

    // =========================
    // CHECK INVENTORY
    // =========================
    for (const item of items) {

      const product =
        await Product.findById(
          item.product
        );

      if (!product) {

        return res.status(404).json({
          message:
            `${item.name} not found`,
        });
      }

      if (product.stock <= 0) {

        return res.status(400).json({
          message:
            `${product.name} is Out Of Stock`,
        });
      }

      product.stock -= item.quantity;

      if (product.stock <= 0) {

        product.available = false;
      }

      await product.save();
    }

    // =========================
    // FORMAT ITEMS
    // =========================
    const formattedItems =
      items.map((item) => ({

        product:
          item.product,

        name:
          item.name || "",

        image:
          item.image || "",

        quantity:
          item.quantity || 1,

        pricePerMonth:
          item.pricePerMonth ||
          item.price ||
          0,
      }));

    // =========================
    // RENTAL DATES
    // =========================
    const rentalStartDate =
      new Date(deliveryDate);

    const rentalEndDate =
      new Date(deliveryDate);

    rentalEndDate.setMonth(

      rentalEndDate.getMonth() +

      Number(rentalDuration || 1)
    );

    // =========================
    // CREATE ORDER
    // =========================
    const order =
      await Order.create({

        user:
          req.user._id,

        customerName:
          req.user.name || "Customer",

        customerEmail:
          req.user.email || "No Email",

        customerPhone:
          req.user.phone ||
          "No Phone",

        items:
          formattedItems,

        rentalDuration,

        totalAmount,

        deliveryDate,

        deliverySlot,

        address,

        paymentMethod:
          paymentMethod || "ONLINE",

        paymentStatus:
          paymentStatus || "Paid",

        status:
          "Placed",

        deliveryStatus:
          "Scheduled",

        pickupStatus:
          "Not Scheduled",

        rentalStartDate,

        rentalEndDate,

        invoiceNumber:
          generateInvoiceNumber(),

        timeline: [
          {
            status:
              "Order Placed",

            date:
              new Date(),
          },
        ],
      });

    // =========================
    // CLEAR CART
    // =========================
    await Cart.deleteMany({
      user: req.user._id,
    });

    // =========================
    // SEND EMAIL
    // =========================
    try {

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          req.user.email,

        subject:
          "RentEase Order Confirmation",

        html: `

          <h2>
            Order Confirmed 🎉
          </h2>

          <p>
            Hello ${req.user.name},
          </p>

          <p>
            Your rental order has been placed successfully.
          </p>

          <p>
            Invoice Number:
            <b>${order.invoiceNumber}</b>
          </p>

          <p>
            Total Amount:
            <b>₹${order.totalAmount}</b>
          </p>

          <p>
            Thank you for choosing RentEase ❤️
          </p>
        `,
      });

    } catch (emailError) {

      console.log(
        "EMAIL ERROR:",
        emailError
      );
    }

    res.status(201).json({

      success: true,

      message:
        "Order placed successfully",

      order,
    });

  } catch (error) {

    console.log(
      "PLACE ORDER ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// =========================
// GET MY ORDERS
// =========================
const getMyOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find({

          user:
            req.user._id,
        })

          .populate({

            path:
              "items.product",

            model:
              "Product",
          })

          .sort({
            createdAt: -1,
          });

      res.json(orders);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =========================
// GET ALL ORDERS
// =========================
const getAllOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find()

          .populate(
            "user",
            "name email phone"
          )

          .populate({

            path:
              "items.product",

            model:
              "Product",
          })

          .sort({
            createdAt: -1,
          });

      // =========================
      // SAFE RESPONSE
      // =========================
      const formattedOrders =
        orders.map((order) => {

          // =========================
          // FIX OLD ORDERS
          // =========================
          let rentalStartDate =
            order.rentalStartDate;

          if (!rentalStartDate) {

            rentalStartDate =
              new Date(
                order.deliveryDate
              );
          }

          let rentalEndDate =
            order.rentalEndDate;

          if (!rentalEndDate) {

            rentalEndDate =
              new Date(
                order.deliveryDate
              );

            rentalEndDate.setMonth(

              rentalEndDate.getMonth() +

              Number(
                order.rentalDuration || 1
              )
            );
          }

          let invoiceNumber =
            order.invoiceNumber;

          if (!invoiceNumber) {

            invoiceNumber =
              generateInvoiceNumber();
          }

          let timeline =
            order.timeline;

          if (
            !Array.isArray(
              timeline
            )
          ) {

            timeline = [];
          }

          // =========================
          // DAYS LEFT
          // =========================
          const today =
            new Date();

          const diffTime =

            rentalEndDate -
            today;

          const daysLeft =
            Math.ceil(

              diffTime /

              (1000 * 60 * 60 * 24)
            );

          // =========================
          // STATUS
          // =========================
          let status =
            order.status;

          let pickupStatus =
            order.pickupStatus;

          if (daysLeft <= 0) {

            status =
              "Expired";

            if (
              pickupStatus ===
              "Not Scheduled"
            ) {

              pickupStatus =
                "Auto Pickup Scheduled";

              timeline.push({

                status:
                  "Auto Pickup Scheduled",

                date:
                  new Date(),
              });
            }

          } else {

            if (
              status !==
              "Completed"
            ) {

              status =
                "Active";
            }
          }

          return {

            _id:
              order._id,

            invoiceNumber,

            user:
              order.user || {

                name:
                  "Deleted User",

                email:
                  "No Email",

                phone:
                  "No Phone",
              },

            customerName:
              order.customerName ||
              "No Name",

            customerEmail:
              order.customerEmail ||
              "No Email",

            customerPhone:
              order.customerPhone ||
              "No Phone",

            address:
              order.address ||
              "No Address",

            items:
              order.items || [],

            rentalDuration:
              order.rentalDuration || 1,

            totalAmount:
              order.totalAmount || 0,

            deliveryDate:
              order.deliveryDate,

            deliverySlot:
              order.deliverySlot ||
              "Morning",

            paymentMethod:
              order.paymentMethod ||
              "ONLINE",

            paymentStatus:
              order.paymentStatus ||
              "Pending",

            pickupStatus,

            deliveryStatus:
              order.deliveryStatus ||
              "Scheduled",

            rentalStartDate,

            rentalEndDate,

            status,

            timeline,

            createdAt:
              order.createdAt,
          };
        });

      res.json(
        formattedOrders
      );

    } catch (error) {

      console.log(
        "❌ GET ALL ORDERS ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to fetch orders",
      });
    }
  };

// =========================
// PRODUCT RENTAL DETAILS
// =========================
const getProductRentalDetails =
  async (req, res) => {

    try {

      const productName =
        req.params.productName;

      const orders =
        await Order.find({

          "items.name":
            productName,
        })

          .populate(
            "user",
            "name email phone"
          );

      res.json(orders);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch analytics",
      });
    }
  };

// =========================
// RENEW RENTAL
// =========================
const renewRental =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      const months =
        Number(
          req.body.months || 1
        );

      order.rentalDuration +=
        months;

      if (!order.rentalEndDate) {

        order.rentalEndDate =
          new Date(
            order.deliveryDate
          );
      }

      const newEndDate =
        new Date(
          order.rentalEndDate
        );

      newEndDate.setMonth(

        newEndDate.getMonth() +
        months
      );

      order.rentalEndDate =
        newEndDate;

      order.pickupStatus =
        "Not Scheduled";

      order.pickupDate = "";

      order.pickupSlot = "";

      if (
        !Array.isArray(
          order.timeline
        )
      ) {

        order.timeline = [];
      }

      order.timeline.push({

        status:
          `Rental Renewed (${months} Month)`,

        date:
          new Date(),
      });

      await order.save();

      res.json({

        success: true,

        message:
          "Rental renewed successfully",

        order,
      });

    } catch (error) {

      console.log(
        "RENEW RENTAL ERROR:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =========================
// UPDATE ORDER STATUS
// =========================
const updateOrderStatus =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.status =
        req.body.status;

      if (
        !Array.isArray(
          order.timeline
        )
      ) {

        order.timeline = [];
      }

      order.timeline.push({

        status:
          `Order ${req.body.status}`,

        date:
          new Date(),
      });

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =========================
// UPDATE DELIVERY STATUS
// =========================
const updateDeliveryStatus =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.deliveryStatus =
        req.body.deliveryStatus;

      if (
        !Array.isArray(
          order.timeline
        )
      ) {

        order.timeline = [];
      }

      order.timeline.push({

        status:
          `Delivery ${req.body.deliveryStatus}`,

        date:
          new Date(),
      });

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =========================
// REQUEST PICKUP
// =========================
const requestPickup =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.pickupStatus =
        "Requested";

      if (
        !Array.isArray(
          order.timeline
        )
      ) {

        order.timeline = [];
      }

      order.timeline.push({

        status:
          "Pickup Requested",

        date:
          new Date(),
      });

      const updatedOrder =
        await order.save();

      res.json({

        success: true,

        message:
          "Pickup Requested Successfully",

        order:
          updatedOrder,
      });

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to request pickup",
      });
    }
  };

// =========================
// UPDATE PICKUP STATUS
// =========================
const updatePickupStatus =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      if (req.body.pickupDate) {

        order.pickupDate =
          req.body.pickupDate;
      }

      if (req.body.pickupSlot) {

        order.pickupSlot =
          req.body.pickupSlot;
      }

      if (req.body.pickupStatus) {

        order.pickupStatus =
          req.body.pickupStatus;
      }

      if (
        !Array.isArray(
          order.timeline
        )
      ) {

        order.timeline = [];
      }

      order.timeline.push({

        status:
          `Pickup ${order.pickupStatus}`,

        date:
          new Date(),
      });

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =========================
// EXPORTS
// =========================
// =========================
// MONTHLY STATEMENT
// =========================
const getMonthlyStatement =
  async (req, res) => {

    try {

      const orders =
        await Order.find();

      const monthlyData = {};

      orders.forEach(order => {

        const month =
          new Date(order.createdAt)
          .toLocaleString(
            "default",
            { month: "long" }
          );

        if (!monthlyData[month]) {

          monthlyData[month] = {

            revenue: 0,

            orders: 0,
          };
        }

        monthlyData[month].revenue +=
          order.totalAmount || 0;

        monthlyData[month].orders += 1;
      });

      res.json(monthlyData);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to fetch monthly statement",
      });
    }
  };

// =========================
// DAILY CUSTOMERS
// =========================
const getDailyCustomers =
  async (req, res) => {

    try {

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const customers =
        await Order.find({

          createdAt: {

            $gte: today,
          },
        })

        .populate(
          "user",
          "name email"
        );

      res.json(customers);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to fetch daily customers",
      });
    }
  };

// =========================
// TOP PRODUCTS
// =========================
const getTopProducts =
  async (req, res) => {

    try {

      const orders =
        await Order.find();

      const productMap = {};

      orders.forEach(order => {

        order.items.forEach(item => {

          if (
            !productMap[item.name]
          ) {

            productMap[item.name] = 0;
          }

          productMap[item.name] +=
            item.quantity || 1;
        });
      });

      const sortedProducts =
        Object.entries(productMap)

        .sort((a, b) =>
          b[1] - a[1]
        );

      res.json(sortedProducts);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to fetch top products",
      });
    }
  };

// =========================
// SEARCH CUSTOMER ORDERS
// =========================
const searchCustomerOrders =
  async (req, res) => {

    try {

      const keyword =
        req.query.keyword;

      const orders =
        await Order.find()

        .populate(
          "user",
          "name email"
        );

      const filtered =
        orders.filter(order =>

          order.user?.name
          ?.toLowerCase()

          .includes(
            keyword.toLowerCase()
          )
        );

      res.json(filtered);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Search failed",
      });
    }
  };

// =========================
// REGULAR CUSTOMERS
// =========================
const getRegularCustomers =
  async (req, res) => {

    try {

      const orders =
        await Order.find()

        .populate(
          "user",
          "name email"
        );

      const customerMap = {};

      orders.forEach(order => {

        const name =
          order.user?.name;

        if (!name) return;

        if (!customerMap[name]) {

          customerMap[name] = {

            orders: 0,

            totalSpent: 0,

            email:
              order.user?.email,
          };
        }

        customerMap[name].orders += 1;

        customerMap[name].totalSpent +=

          order.totalAmount || 0;
      });

      const regularCustomers =
        Object.entries(customerMap)

        .filter(
          ([_, value]) =>

            value.orders >= 2
        )

        .map(([name, value]) => ({

          name,

          ...value,
        }));

      res.json(
        regularCustomers
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to fetch regular customers",
      });
    }
  };

// =========================
// EXPORTS
// =========================
module.exports = {

  placeOrder,

  getMyOrders,

  getAllOrders,

  getProductRentalDetails,

  renewRental,

  updateOrderStatus,

  updateDeliveryStatus,

  requestPickup,

  updatePickupStatus,

  // =========================
  // ANALYTICS
  // =========================
  getMonthlyStatement,

  getDailyCustomers,

  getTopProducts,

  searchCustomerOrders,

  getRegularCustomers,
};