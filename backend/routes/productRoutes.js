const express = require("express");

const router = express.Router();

const {

  addProduct,

  getProducts,

  getSingleProduct,

  updateProduct,

  deleteProduct,

} = require(
  "../controllers/productController"
);

// =========================
// GET ALL PRODUCTS
// ADD PRODUCT
// =========================
router.route("/")

  .get(getProducts)

  .post(addProduct);

// =========================
// GET SINGLE PRODUCT
// UPDATE PRODUCT
// DELETE PRODUCT
// =========================
router.route("/:id")

  .get(getSingleProduct)

  .put(updateProduct)

  .delete(deleteProduct);

module.exports = router;