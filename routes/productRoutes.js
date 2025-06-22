const express = require("express");
const router = express.Router();
const imageUpload = require("../middleware/imageUpload");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getProductImage,
} = require("../controllers/productControllers");

router.post("/", imageUpload, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.get("/:id/image", getProductImage);

module.exports = router;
