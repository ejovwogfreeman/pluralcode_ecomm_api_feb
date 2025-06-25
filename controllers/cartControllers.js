const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
  try {
    // const { productId, quantity } = req.body;
    console.log(req.body);
    // let cart = await Cart.findOne();

    // if (!cart) {
    //   cart = new Cart();
    // }

    // const existingItem = cart.items.find(
    //   (item) => item.product.toString() === productId
    // );

    // if (existingItem) {
    //   existingItem.quantity += quantity;
    // } else {
    //   cart.items.push({ product: productId, quantity });
    // }

    // await cart.save();
    // res.json({ msg: "item added to cart" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "failed to add to cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await cart.findOne();

    if (!cart) return res.status(404).json({ msg: "cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json({ msg: "item removed from cart" });
  } catch (err) {
    res.status(500).json({ msg: "failed to remove from cart" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
};
