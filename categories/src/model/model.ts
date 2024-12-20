import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: "",
  },
});

const categoryModel = mongoose.model("categories", schema);

export default categoryModel;
