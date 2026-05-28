const mongoose = require("mongoose");

const orderSchema =
  new mongoose.Schema(

    {

      // =========================
      // USER
      // =========================
      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      // =========================
      // CUSTOMER INFO
      // =========================
      customerName: {

        type: String,

        required: true,
      },

      customerEmail: {

        type: String,

        required: true,
      },

      customerPhone: {

        type: String,

        required: true,
      },

      // =========================
      // ORDER ITEMS
      // =========================
      items: [

        {

          product: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: "Product",

            required: true,
          },

          name: {

            type: String,

            required: true,
          },

          image: {

            type: String,

            required: true,
          },

          pricePerMonth: {

            type: Number,

            required: true,
          },

          quantity: {

            type: Number,

            default: 1,
          },
        },
      ],

      // =========================
      // RENTAL
      // =========================
      rentalDuration: {

        type: Number,

        required: true,
      },

      rentalStartDate: {

        type: Date,
      },

      rentalEndDate: {

        type: Date,
      },

      // =========================
      // PAYMENT
      // =========================
      totalAmount: {

        type: Number,

        required: true,
      },

      paymentMethod: {

        type: String,

        default: "ONLINE",
      },

      paymentStatus: {

        type: String,

        enum: [

          "Pending",

          "Paid",

          "Failed",
        ],

        default: "Pending",
      },

      invoiceNumber: {

        type: String,

        default: "",
      },

      // =========================
      // DELIVERY
      // =========================
      deliveryDate: {

        type: Date,

        required: true,
      },

      deliverySlot: {

        type: String,

        enum: [

          "Morning",

          "Afternoon",

          "Evening",
        ],

        default: "Morning",
      },

      deliveryStatus: {

        type: String,

        enum: [

          "Scheduled",

          "Out for Delivery",

          "Delivered",
        ],

        default: "Scheduled",
      },

      // =========================
      // ADDRESS
      // =========================
      address: {

        type: String,

        required: true,
      },

      // =========================
      // ORDER STATUS
      // =========================
      status: {

        type: String,

        enum: [

          "Placed",

          "Active",

          "Expired",

          "Cancelled",

          "Completed",
        ],

        default: "Placed",
      },

      // =========================
      // PICKUP
      // =========================
      pickupDate: {

        type: String,

        default: "",
      },

      pickupSlot: {

        type: String,

        enum: [

          "",

          "Morning",

          "Afternoon",

          "Evening",
        ],

        default: "",
      },

      pickupStatus: {

        type: String,

        enum: [

          "Not Scheduled",

          "Requested",

          "Pickup Scheduled",

          "Auto Pickup Scheduled",

          "Picked Up",
        ],

        default: "Not Scheduled",
      },

      // =========================
      // TIMELINE
      // =========================
      timeline: [

        {

          status: String,

          date: {

            type: Date,

            default: Date.now,
          },
        },
      ],

      // =========================
      // EMAIL FLAGS
      // =========================
      reminderSent: {

        type: Boolean,

        default: false,
      },

      pickupEmailSent: {

        type: Boolean,

        default: false,
      },

      renewalEmailSent: {

        type: Boolean,

        default: false,
      },
    },

    {

      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );