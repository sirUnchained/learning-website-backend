import express from "express";
import PurchaseController from "../controller/purchase";
const purchaseRoutes: express.Router = express.Router();

const purchaseController = new PurchaseController();

purchaseRoutes.route("/").get(purchaseController.getAllForAdmin);
purchaseRoutes.route("/").post(purchaseController.newPurchase);
purchaseRoutes.route("/").put(purchaseController.updatePurchase);
purchaseRoutes.route("/").delete(purchaseController.removePurchase);

export default purchaseRoutes;
