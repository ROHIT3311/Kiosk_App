const Order = require("../models/Order");

// ➕ Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Generate random order number
    const orderNumber = Math.floor(1000 + Math.random() * 9000);

    const order = await Order.create({
      items,
      totalAmount,
      orderNumber,

      shopId: req.user.shopId,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// 📦 Get Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      shopId: req.user.shopId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// 🔄 Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        shopId: req.user.shopId,
      },

      {
        status,
      },

      {
        new: true,
      },
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
