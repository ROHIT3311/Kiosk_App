const Product = require("../models/product.model");

// ➕ Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      image,
      shopId: req.user.shopId, // 🔥 KEY POINT
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📦 Get Products (ONLY for that admin)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      shopId: req.user.shopId, // 🔥 FILTER
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      shopId: req.user.shopId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        shopId: req.user.shopId,
      },
      {
        name,
        price,
        category,
        image,
      },
      {
        new: true,
      },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      shopId: req.user.shopId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
