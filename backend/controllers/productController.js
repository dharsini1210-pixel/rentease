const Product = require("../models/Product");

// =========================
// ADD PRODUCT
// =========================
const addProduct = async (req, res) => {

  try {

    const {
      name,
      category,
      pricePerMonth,
      deposit,
      image,
      stock,
      available,
    } = req.body;

    const product =
      await Product.create({

        name,

        category,

        pricePerMonth,

        deposit,

        image,

        stock,

        available,
      });

    res.status(201).json({

      message:
        "Product added",

      product,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        error.message,
    });
  }
};

// =========================
// GET ALL PRODUCTS
// =========================
const getProducts =
  async (req, res) => {

    try {

      const products =
        await Product.find();

      res.json(products);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,
      });
    }
  };

// =========================
// GET SINGLE PRODUCT
// =========================
const getSingleProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      res.json(product);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,
      });
    }
  };

// =========================
// UPDATE PRODUCT
// =========================
const updateProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({

          message:
            "Product not found",
        });
      }

      // =========================
      // UPDATE FIELDS
      // =========================
      product.name =
        req.body.name ||
        product.name;

      product.category =
        req.body.category ||
        product.category;

      product.pricePerMonth =
        req.body.pricePerMonth ||
        product.pricePerMonth;

      product.deposit =
        req.body.deposit ||
        product.deposit;

      product.image =
        req.body.image ||
        product.image;

      // =========================
      // STOCK
      // =========================
      product.stock =
        req.body.stock;

      // =========================
      // AVAILABILITY
      // =========================
      product.available =
        req.body.available;

      // =========================
      // SAVE
      // =========================
      const updatedProduct =
        await product.save();

      res.json(
        updatedProduct
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to update product",
      });
    }
  };

// =========================
// DELETE PRODUCT
// =========================
const deleteProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({

          message:
            "Product not found",
        });
      }

      await product.deleteOne();

      res.json({

        message:
          "Product deleted",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,
      });
    }
  };

module.exports = {

  addProduct,

  getProducts,

  getSingleProduct,

  updateProduct,

  deleteProduct,
};