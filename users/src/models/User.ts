import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      lowerCase: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "TEACHER"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("users", schema);

export default model;
