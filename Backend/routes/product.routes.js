const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// Protected routes
router.post("/", authMiddleware, adminMiddleware, addProduct);
router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProductById);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
