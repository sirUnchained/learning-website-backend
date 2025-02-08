import { NextFunction, RequestHandler } from "express";
import PurchaseService from "../services/service";

const purchaseService = new PurchaseService();

class PurchaseController {
  public getAllForAdmin: RequestHandler = async (req, res, next) => {
    const data = await purchaseService.getAllForAdmin(req);
    res.status(200).json(data);
    return;
  };

  public newPurchase: RequestHandler = async (req, res, next) => {
    // todo
  };

  public purchaseCallback: RequestHandler = async (req, res, next) => {
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
