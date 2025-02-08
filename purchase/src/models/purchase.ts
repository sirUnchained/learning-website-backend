import { model, Schema } from "mongoose";

const schema: Schema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
    Min: 0,
  },
  trackId: {
    type: Number,
    require: true,
    Min: 0,
  },
});

const purchaseModel = model("purchase-model", schema);

export default purchaseModel;
