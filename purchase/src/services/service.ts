import { Request } from "express";
import { getTrackId } from "../utils/zibal";
import purchaseModel from "../models/purchase";

class PurchaseService {
  public getAllForAdmin: Function = async (req: Request) => {
    // todo
  };

  public newPurchase: Function = async (req: any) => {
    try {
      const amount = req.body?.amount as number;

      const result = await getTrackId(amount);
      if (result.result != 100) {
        return { result: 500, data: "somthing failed from zibal." };
      }

      const newPurchase = new purchaseModel({
        amount,
        trackId: String(result.trackId),
        userId: req.user._id,
        courseId: req.body.courseId,
      });
      await newPurchase.save();

      return { result: 201, data: result };
    } catch (error: any) {
      return { result: 500, data: error.message };
    }
  };

  public purchaseCallback: Function = async (req: Request) => {
    try {
      const paymentResult = req.params as {
        trackId: string;
        success: string;
        status: string;
        orderId?: string;
      };

      const purchase = await purchaseModel.findOne({
        trackId: paymentResult.trackId,
      });
      if (!purchase) {
        return {
          result: 500,
          data: "somthing went wrong, purchase not found.",
        };
      }

      purchase.paymentStatus = !!+paymentResult.status;
      await purchase.save();

      return { result: 201, data: purchase };
    } catch (error: any) {
      return { result: 500, data: error.message };
    }
  };

  public updatePurchase: Function = async (req: Request) => {
    // todo
  };

  public removePurchase: Function = async (req: Request) => {
    // todo
  };
}

export default PurchaseService;
