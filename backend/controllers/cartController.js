const Cart = require("../models/Cart");

// =========================
// ADD TO CART
// =========================
const addToCart = async (req, res) => {

  try {

    // CHECK USER
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const {
      productId,
      quantity
    } = req.body;

    // CHECK EXISTING ITEM
    let cartItem = await Cart.findOne({

      user: req.user._id,

      product: productId
    });

    // =========================
    // UPDATE QUANTITY
    // =========================
    if (cartItem) {

      cartItem.quantity = quantity;

      await cartItem.save();

    } else {

      // =========================
      // CREATE NEW ITEM
      // =========================
      cartItem = await Cart.create({

        user: req.user._id,

        product: productId,

        quantity
      });
    }

    res.status(201).json({

      message: "Cart updated",

      cartItem
    });

  } catch (error) {

    console.log(
      "❌ ADD CART ERROR:",
      error
    );

    res.status(500).json({

      message: error.message
    });
  }
};

// =========================
// GET USER CART
// =========================
const getCart = async (req, res) => {

  try {

    // CHECK USER
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const cart = await Cart.find({

      user: req.user._id

    }).populate("product");

    res.json(cart);

  } catch (error) {

    console.log(
      "❌ GET CART ERROR:",
      error
    );

    res.status(500).json({

      message: error.message
    });
  }
};

// =========================
// REMOVE FROM CART
// =========================
const removeFromCart = async (req, res) => {

  try {

    const { id } = req.params;

    await Cart.findByIdAndDelete(id);

    res.json({

      message: "Item removed from cart"
    });

  } catch (error) {

    console.log(
      "❌ REMOVE CART ERROR:",
      error
    );

    res.status(500).json({

      message: error.message
    });
  }
};

module.exports = {

  addToCart,

  getCart,

  removeFromCart
};