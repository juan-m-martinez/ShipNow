const mongoose = require("mongoose");
const { PRODUCT_STATUS } = require("../constants");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
