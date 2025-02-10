import { Request } from "express";
import { getTrackId } from "../utils/zibal";
import purchaseModel from "../models/purchase";
import { callService } from "../rabbitMQ";

class PurchaseService {
  public getAllForAdmin: Function = async (
    req: Request
  ): Promise<{ status: Number; result: any }> => {
    const { limit, page } = req.params;

    const purchases = await purchaseModel
      .find()
      .limit(Number(limit) || 10)
      .skip((Number(page) - 1) * Number(limit) || 1);

    return { status: 200, result: purchases };
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

  // public getSingleForAdmin: Function = async (req: Request): Promise<{ status: Number; result: any }> => {};

  public newPurchase: Function = async (req: any) => {
    try {
      // the only thing should be validated is courseId
      if (!req.body?.courseId) {
        return { status: 400, result: "courseId found." };
      }

      const checkCourse = await callService("COURSE", {
        action: "getSingle",
        replyServiceName: "purchase_course",
        body: { id: req.body.courseId },
      });
      if (checkCourse.status != 200) {
        return { status: 404, result: "course not found." };
      }

      const result = await getTrackId(checkCourse.price);
      if (result.result != 100) {
        console.log(result);
        return { status: 500, result: "somthing failed from zibal." };
      }

      const newPurchase = new purchaseModel({
        amount: checkCourse.price,
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

  public purchaseCallback: Function = async (
    req: Request
  ): Promise<{ status: Number; result: any }> => {
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

  // public updatePurchase: Function = async (
  //   req: Request
  // ): Promise<{ status: Number; result: any }> => {
  // todo => updatePurchaseService
  // };

  // public removePurchase: Function = async (
  //   req: Request
  // ): Promise<{ status: Number; result: any }> => {
  // todo => removePurchaseService
  // };
}

export default PurchaseService;
