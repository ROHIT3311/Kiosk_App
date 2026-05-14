const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  placeOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

// Place Order
router.post("/", authMiddleware, placeOrder);

// Get Orders
router.get("/", authMiddleware, getOrders);

// Update Status
router.put("/:id", authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
