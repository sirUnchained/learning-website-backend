import express from "express";
import PurchaseController from "../controller/purchase";
import authorization from "../middleware/auth";
import isAdmin from "../middleware/isAdmin";
const purchaseRoutes: express.Router = express.Router();

const purchaseController = new PurchaseController();

purchaseRoutes
  .route("/")
  .get(authorization, isAdmin, purchaseController.getAllForAdmin);
purchaseRoutes.route("/").post(purchaseController.newPurchase);
purchaseRoutes.route("/").put(purchaseController.updatePurchase);
purchaseRoutes.route("/").delete(purchaseController.removePurchase);

export default purchaseRoutes;
