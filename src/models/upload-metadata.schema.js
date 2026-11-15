const mongoose = require("mongoose");
const { USER_DOCUMENT_TYPE, DELIVERY_PROOF_TYPE } = require("../constants");

const uploadMetadataSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    generatedName: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 1 },
    documentType: {
      type: String,
      enum: [
        ...Object.values(USER_DOCUMENT_TYPE),
        ...Object.values(DELIVERY_PROOF_TYPE),
      ],
      required: true,
    },
    uploadedAt: { type: Date, default: Date.now, required: true },
  },
  { _id: false },
);

module.exports = uploadMetadataSchema;
