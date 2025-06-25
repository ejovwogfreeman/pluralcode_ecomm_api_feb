const express = require("express");
const router = express.Router();

// const { addToCart, removeFromCart } = require("../controllers/cartControllers");

const { addToCart, removeFromCart } = require("../controllers/cartControllers");

router.post("/add", addToCart);
router.post("/remove", removeFromCart);

module.exports = router;
