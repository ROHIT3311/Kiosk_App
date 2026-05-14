const User = require("../models/user.model");
const Shop = require("../models/shop.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, shopName, location } = req.body;

    // Validate required fields
    if (!name || !email || !password || !shopName) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Password validation
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number and special character",
      });
    }

    // Existing user check
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create shop
    const shop = await Shop.create({
      name: shopName,
      location,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      shopId: shop._id,
      role: "admin",
    });

    res.status(201).json({
      message: "Registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        shopId: user.shopId,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        shopId: user.shopId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 🔥 Store in cookie
    res.cookie("token", token, {
      httpOnly: true, // 🔐 cannot access via JS
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;

    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Send email
    await sendEmail({
      email: user.email,

      subject: "Password Reset OTP",

      message: `
        <h2>Password Reset OTP</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>Valid for 10 minutes</p>
      `,
    });

    res.json({
      message: "OTP sent to email",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetOtp: otp,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check expiry
    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // Clear OTP
    user.resetOtp = undefined;

    user.resetOtpExpires = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
