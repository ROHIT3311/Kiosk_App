const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Shop", shopSchema);
