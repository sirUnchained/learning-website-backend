import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    teacherID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    info: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    cover: {
      type: String,
      required: false,
      default: "",
    },
    isFinished: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model("courses", schema);

export default courseModel;
