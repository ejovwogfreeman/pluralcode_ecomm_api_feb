const Product = require("../models/productModel");

// create product
const createProduct = async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ msg: "Image is required" });

    const product = new Product({
      name,
      description,
      category,
      price,
      image: {
        data: file.buffer,
        contentType: file.mimetye,
      },
    });

    await product.save();
    res.status(201).json({ msg: "Product created", product });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create product", err });
  }
};

// get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}, { image: 0 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching proudcts", err });
  }
};

// get single product
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, { image: 0 });
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching proudct", err });
  }
};

// get product image (by its id)

const getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.image || !product.image.data) {
      return res.status(404).json({ msg: "Image not found" });
    }
    res.contentType(product.image.contentType);
    res.send(product.image.data);
  } catch (err) {
    res.status(500).json({ msg: "Error retrieving images" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getProductImage,
};
