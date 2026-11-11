const mongoose = require("mongoose");
const { USER_ROLE } = require("../constants");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
