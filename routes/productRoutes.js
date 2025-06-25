const express = require("express");
const router = express.Router();
const imageUpload = require("../middleware/imageUpload");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getProductImage,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

router.post("/", imageUpload, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.get("/:id/image", getProductImage);
router.put("/:id", imageUpload, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
