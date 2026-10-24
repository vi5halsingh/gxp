import mongoose from "mongoose";

const inputSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "number", "email", "date", "textarea"],
      default: "text",
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "seller"],
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const inputmodel = mongoose.model("Input", inputSchema);

export default inputmodel;