const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    resetOtp: String,

    resetOtpExpires: Date,

    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "admin",
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
