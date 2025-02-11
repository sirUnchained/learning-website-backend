import { model, Schema } from "mongoose";

const schema: Schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
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
    couldBeUpdated: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// middleware to prevent updates
schema.pre("save", function (next) {
  if (!this.couldBeUpdated) {
    return next(new Error("Document updates are not allowed."));
  }
  this.couldBeUpdated = false;
  next();
});

const purchaseModel = model("purchase-model", schema);

export default purchaseModel;
