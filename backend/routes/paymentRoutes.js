const express = require("express");

const Razorpay = require("razorpay");

const crypto = require("crypto");

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
// CREATE ORDER
// =========================
router.post(
  "/create-order",

  async (req, res) => {

    try {

      const {
        amount,
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
          "Failed to create order",
      });
    }
  }
);

// =========================
// VERIFY PAYMENT
// =========================
router.post(
  "/verify",

  async (req, res) => {

    try {

      const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

      } = req.body;

      // CREATE SIGNATURE
      const sign =

        razorpay_order_id +
        "|" +
        razorpay_payment_id;

      const expectedSign =

        crypto
          .createHmac(

            "sha256",

            process.env
              .RAZORPAY_KEY_SECRET
          )

          .update(sign.toString())

          .digest("hex");

      // VERIFY
      if (
        expectedSign ===
        razorpay_signature
      ) {

        return res.json({

          success: true,

          message:
            "Payment Verified",
        });
      }

      return res.status(400).json({

        success: false,

        message:
          "Invalid Signature",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Verification Failed",
      });
    }
  }
);

module.exports = router;