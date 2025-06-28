const Order = require("../models/orderModel");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: "items.product",
      select: { image: 0 },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "failed to get orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "items.product",
      select: { image: 0 },
    });
    if (!order) return res.status(400).json({ msg: "order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "failed to order" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
};
