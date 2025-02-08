import { NextFunction, RequestHandler } from "express";

class PurchaseController {
  public getAllForAdmin: RequestHandler = async (req, res, next) => {
    res.status(200).json({ msg: "done." });
    return;
  };

  public newPurchase: RequestHandler = async (req, res, next) => {
    // todo
  };

  public updatePurchase: RequestHandler = async (req, res, next) => {
    // todo
  };

  public removePurchase: RequestHandler = async (req, res, next) => {
    // todo
  };
}

export default PurchaseController;
