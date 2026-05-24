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

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

// =========================
// PLACE ORDER
// =========================
const placeOrder = async (req, res) => {

  try {

    console.log(
      "PLACE ORDER API HIT"
    );

    console.log(req.body);

    const {

      address,

      rentalDuration,

      deliveryDate,

      deliverySlot,

      totalAmount,

      paymentStatus,

      items,

    } = req.body;

    // =========================
    // CHECK EMPTY ITEMS
    // =========================
    if (
      !items ||
      items.length === 0
    ) {

      return res.status(400).json({

        message:
          "No order items",
      });
    }

    // =========================
    // INVENTORY CHECK
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

      // OUT OF STOCK
      if (
        product.stock <= 0
      ) {

        return res.status(400).json({

          message:
            `${product.name} is Out Of Stock`,
        });
      }

      // REDUCE STOCK
      product.stock =
        product.stock -
        item.quantity;

      // AUTO UNAVAILABLE
      if (
        product.stock <= 0
      ) {

        product.available =
          false;
      }

      await product.save();
    }

    // =========================
    // FORMAT ITEMS
    // =========================
    const formattedItems =
      items.map((item) => ({

        name:
          item.name || "",

        image:
          item.image ||

          "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800",

        price:
          item.price || 0,

        pricePerMonth:

          item.pricePerMonth ||

          item.rent ||

          item.monthlyRent ||

          item.price ||

          0,

        deposit:
          item.deposit || 0,

        category:
          item.category || "",

        quantity:
          item.quantity || 1,

        product:
          item.product,
      }));

    // =========================
    // CREATE ORDER
    // =========================
    const order =
      await Order.create({

        user:
          req.user._id,

        // ✅ CUSTOMER INFO
        customerName:
          req.user.name,

        customerEmail:
          req.user.email,

        customerPhone:
          req.user.phone,

        items:
          formattedItems,

        rentalDuration,

        totalAmount,

        deliveryDate,

        deliverySlot,

        address,

        paymentStatus:

          paymentStatus ||

          "Pending",

        status:
          "Placed",

        deliveryStatus:
          "Scheduled",

        pickupStatus:
          "Not Scheduled",
      });

    // =========================
    // CLEAR CART
    // =========================
    await Cart.deleteMany({

      user:
        req.user._id,
    });

    // =========================
    // SEND EMAIL
    // =========================
    try {

      const productNames =
        formattedItems

          .map(
            (item) =>
              item.name
          )

          .join(", ");

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          req.user.email,

        subject:
          "RentEase Order Confirmation",

        html: `

          <div style="font-family: Arial; padding: 20px;">

            <h1 style="color:#1e3c72;">
              RentEase Order Confirmed 🎉
            </h1>

            <p>
              Hello ${req.user.name},
            </p>

            <p>
              Your rental order has been placed successfully.
            </p>

            <h3>
              Order Details
            </h3>

            <ul>

              <li>
                <strong>Products:</strong>
                ${productNames}
              </li>

              <li>
                <strong>Total Amount:</strong>
                ₹${totalAmount}
              </li>

              <li>
                <strong>Phone:</strong>
                ${req.user.phone}
              </li>

              <li>
                <strong>Payment Status:</strong>
                ${paymentStatus}
              </li>

              <li>
                <strong>Delivery Slot:</strong>
                ${deliverySlot}
              </li>

              <li>
                <strong>Address:</strong>
                ${address}
              </li>

            </ul>

            <p>
              Thank you for choosing RentEase ❤️
            </p>

          </div>
        `,
      });

      console.log(
        "EMAIL SENT SUCCESSFULLY"
      );

    } catch (emailError) {

      console.log(
        "EMAIL ERROR:",
        emailError
      );
    }

    // =========================
    // SUCCESS
    // =========================
    res.status(201).json({

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

      console.log(

        "GET MY ORDERS ERROR:",

        error
      );

      res.status(500).json({

        message:
          error.message,
      });
    }
  };

// =========================
// ADMIN GET ALL ORDERS
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

      res.json(orders);

    } catch (error) {

      console.log(

        "GET ALL ORDERS ERROR:",

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

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);

    } catch (error) {

      console.log(error);

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

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);

    } catch (error) {

      console.log(error);

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

      const updatedOrder =
        await order.save();

      res.json({

        success: true,

        message:
          "Pickup Requested Successfully",

        pickupStatus:
          updatedOrder.pickupStatus,

        order:
          updatedOrder,
      });

    } catch (error) {

      console.log(error);

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

      if (
        req.body.pickupDate
      ) {

        order.pickupDate =
          req.body.pickupDate;
      }

      if (
        req.body.pickupSlot
      ) {

        order.pickupSlot =
          req.body.pickupSlot;
      }

      if (
        req.body.pickupStatus
      ) {

        order.pickupStatus =
          req.body.pickupStatus;
      }

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,
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

  updateOrderStatus,

  updateDeliveryStatus,

  requestPickup,

  updatePickupStatus,
};