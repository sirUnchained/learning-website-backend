import express from "express";
import PurchaseController from "../controller/purchase";
import authorization from "../middleware/auth";
import isAdmin from "../middleware/isAdmin";
const purchaseRoutes: express.Router = express.Router();

const purchaseController = new PurchaseController();

purchaseRoutes
  .route("/")
  .get(authorization, isAdmin, purchaseController.getAllForAdmin);

purchaseRoutes.route("/").post(authorization, purchaseController.newPurchase);
purchaseRoutes
  .route("/zibal-cb")
  .post(authorization, purchaseController.purchaseCallback);

purchaseRoutes
  .route("/")
  .put(authorization, isAdmin, purchaseController.updatePurchase);
purchaseRoutes
  .route("/")
  .delete(authorization, isAdmin, purchaseController.removePurchase);

export default purchaseRoutes;
