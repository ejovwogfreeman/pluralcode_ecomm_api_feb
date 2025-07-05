const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let { quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: "Product id is required" });
    }

    quantity = Number(quantity);

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      quantity = 1;
    }

    let cart = await Cart.findOne();

    if (!cart) cart = new Cart();

    // check for existing item
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(200).json({
        msg: "Item already in cart",
        cart,
      });
    }

    // if no existing item, add to cart
    cart.items.push({ product: productId, quantity });

    await cart.save();

    res.json({ msg: "Item added to cart successfully", cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "failed to add to cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const existingCart = await Cart.findOne();

    if (!existingCart) {
      return res.status(404).json({ msg: "cart not found" });
    }

    existingCart.items = existingCart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await existingCart.save();

    res.json({ msg: "item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "failed to remove from cart" });
  }
};

const increaseCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: "Product id is required" });
    }

    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ msg: "cart not found" });

    // check for existing item
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ msg: "item not found in cart" });
    }

    item.quantity += 1;

    await cart.save();

    res.json({ msg: "item quantity increased" });
  } catch (err) {
    re.status(500).json({ msg: "failed to increase quantity" });
  }
};

const decreaseCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: "Product id is required" });
    }

    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ msg: "cart not found" });

    // check for existing item
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ msg: "item not found in cart" });
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
      await cart.save();

      res.json({ msg: "item quantity decreased" });
    } else {
      res.status(400).json({ msg: "minimum quantity is 1" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "failed to decrease quantity" });
  }
};

const getCart = async (req, res) => {
  try {
    // const cart = await Cart.findOne().populate("items.product", "-image");

    const cart = await Cart.findOne().populate({
      path: "items.product",
      select: { image: 0 },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ msg: "cart is empty" });
    }

    res.json({ cart });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "failed to get cart", err });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ msg: "Cart is empty" });
    }

    // Filter out invalid (unpopulated) products
    const validItems = cart.items.filter((item) => item.product);

    if (validItems.length === 0) {
      return res.status(400).json({ msg: "Cart has no valid products" });
    }

    // Calculate total
    const total = validItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Create and save order
    const order = new Order({
      items: validItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      total,
    });

    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({ msg: "Checkout successful, order placed", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to checkout cart" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  getCart,
  checkoutCart,
};
