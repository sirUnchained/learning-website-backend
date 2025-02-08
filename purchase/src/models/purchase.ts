import { model, Schema } from "mongoose";

const schema: Schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      Min: 0,
    },
    trackId: {
      type: String,
      required: true,
      Min: 0,
      unique: true,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const purchaseModel = model("purchase-model", schema);

export default purchaseModel;
