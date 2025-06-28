const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const {
  addToCart,
  removeFromCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  getCart,
  checkoutCart,
} = require("../controllers/cartControllers");

router.post("/add", upload.none(), addToCart);
router.post("/remove", upload.none(), removeFromCart);
router.post("/increase", upload.none(), increaseCartItemQuantity);
router.post("/decrease", upload.none(), decreaseCartItemQuantity);
router.get("/", getCart);
router.post("/checkout", checkoutCart);

module.exports = router;
