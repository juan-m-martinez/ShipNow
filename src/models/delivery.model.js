const mongoose = require("mongoose");
const { DELIVERY_STATUS } = require("../constants");
const uploadMetadataSchema = require("./upload-metadata.schema");

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    courier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(DELIVERY_STATUS),
      default: DELIVERY_STATUS.PENDING,
      required: true,
    },
    proofs: { type: [uploadMetadataSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Delivery", deliverySchema);
