const express = require("express");

const Razorpay = require("razorpay");

const router = express.Router();

// =========================
// RAZORPAY INSTANCE
// =========================
const razorpay =
  new Razorpay({

    key_id:
      process.env
        .RAZORPAY_KEY_ID,

    key_secret:
      process.env
        .RAZORPAY_KEY_SECRET,
  });

// =========================
// CREATE PAYMENT ORDER
// =========================
router.post(
  "/create-order",

  async (req, res) => {

    try {

      const {
        amount
      } = req.body;

      const options = {

        amount:
          amount * 100,

        currency:
          "INR",

        receipt:
          `receipt_${Date.now()}`,
      };

      const order =
        await razorpay.orders.create(
          options
        );

      res.json(order);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to create payment order",
      });
    }
  }
);

module.exports = router;