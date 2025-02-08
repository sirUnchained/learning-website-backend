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
    // todo => newPurchase
  };

  public purchaseCallback: RequestHandler = async (req, res, next) => {
    // todo => purchaseCallback
  };

  public updatePurchase: RequestHandler = async (req, res, next) => {
    // todo => updatePurchase
  };

  public removePurchase: RequestHandler = async (req, res, next) => {
    // todo => removePurchase
  };
}

export default PurchaseController;
