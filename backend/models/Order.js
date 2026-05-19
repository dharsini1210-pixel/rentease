const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(

  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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
    // RENTAL DURATION
    // =========================
    rentalDuration: {
      type: Number,
      required: true,
    },

    // =========================
    // TOTAL AMOUNT
    // =========================
    totalAmount: {
      type: Number,
      required: true,
    },

    // =========================
    // DELIVERY DATE
    // =========================
    deliveryDate: {
      type: Date,
      required: true,
    },

    // =========================
    // DELIVERY SLOT
    // =========================
    deliverySlot: {
      type: String,

      enum: [
        "Morning",
        "Afternoon",
        "Evening",
      ],

      default: "Morning",
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
        "Pending",
        "Placed",
        "Confirmed",
        "Delivered",
        "Completed",
        "Cancelled",
      ],

      default: "Placed",
    },

    // =========================
    // DELIVERY STATUS
    // =========================
    deliveryStatus: {
      type: String,

      enum: [
        "Scheduled",
        "Out for Delivery",
        "Out For Delivery",
        "Delivered",
      ],

      default: "Scheduled",
    },

    // =========================
    // PICKUP DATE
    // =========================
    pickupDate: {
      type: String,
      default: "",
    },

    // =========================
    // PICKUP SLOT
    // =========================
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

    // =========================
    // PICKUP STATUS
    // =========================
    pickupStatus: {
      type: String,

      enum: [
        "Not Scheduled",
        "Pickup Scheduled",
        "Picked Up",
      ],

      default: "Not Scheduled",
    },

    // =========================
    // PAYMENT STATUS
    // =========================
    paymentStatus: {
      type: String,

      enum: [
        "Pending",
        "Paid",
        "Failed",
      ],

      default: "Pending",
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