const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(

  {
    // =========================
    // PRODUCT NAME
    // =========================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // CATEGORY
    // =========================
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // MONTHLY RENT
    // =========================
    pricePerMonth: {
      type: Number,
      required: true,
    },

    // =========================
    // SECURITY DEPOSIT
    // =========================
    deposit: {
      type: Number,
      required: true,
    },

    // =========================
    // DESCRIPTION
    // =========================
    description: {
      type: String,
      default: "",
    },

    // =========================
    // IMAGE
    // =========================
    image: {
      type: String,

      default:
        "https://via.placeholder.com/300",
    },

    // =========================
    // STOCK
    // =========================
    stock: {
      type: Number,

      required: true,

      default: 1,
    },

    // =========================
    // AVAILABILITY
    // =========================
    available: {
      type: Boolean,

      default: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Product",
    productSchema
  );