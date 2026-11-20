const mongoose = require("mongoose");
const { ORDER_STATUS, ORDER_PRIORITY } = require("../constants");
const uploadMetadataSchema = require("./upload-metadata.schema");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(ORDER_PRIORITY),
      default: ORDER_PRIORITY.MEDIUM,
      required: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    proofs: { type: [uploadMetadataSchema], default: [] },
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
