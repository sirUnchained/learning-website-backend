import { Request } from "express";
import { getTrackId } from "../utils/zibal";
import purchaseModel from "../models/purchase";

class PurchaseService {
  public getAllForAdmin: Function = async (req: Request) => {
    const { limit, page } = req.params;

    const purchases = await purchaseModel
      .find()
      .limit(Number(limit) || 10)
      .skip((Number(page) - 1) * Number(limit) || 1);

    return { result: 200, data: purchases };
  };

  public getAllForSingleUser: Function = async (req: any) => {
    const { limit, page } = req.params;
    const userId = req.user._id;

    const purchases = await purchaseModel
      .find({ userId })
      .limit(Number(limit) || 10)
      .skip((Number(page) - 1) * Number(limit) || 1);

    return { result: 200, data: purchases };
  };

  public getSingleForAdmin: Function = async (req: Request) => {};

  public newPurchase: Function = async (req: any) => {
    try {
      const amount = req.body?.amount as number;

      const result = await getTrackId(amount);
      if (result.result != 100) {
        return { status: 500, result: "somthing failed from zibal." };
      }

      const newPurchase = new purchaseModel({
        amount,
        trackId: String(result.trackId),
        userId: req.user._id,
        courseId: req.body.courseId,
      });
      await newPurchase.save();

      return { status: 201, result: result };
    } catch (error: any) {
      return { status: 500, result: error.message };
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
          status: 500,
          result: "somthing went wrong, purchase not found.",
        };
      }

      purchase.paymentStatus = !!+paymentResult.status;
      await purchase.save();

      return { status: 201, result: purchase };
    } catch (error: any) {
      return { status: 500, result: error.message };
    }
  };

  public updatePurchase: Function = async (req: Request) => {
    // todo => updatePurchaseService
  };

  public removePurchase: Function = async (req: Request) => {
    // todo => removePurchaseService
  };
}

export default PurchaseService;
