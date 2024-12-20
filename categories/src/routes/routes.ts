import express, { Router } from "express";
import * as controller from "./../controller/controller";
import authorization from "../middleWares/auth";
import isAdmin from "../middleWares/isAdmin";

const router: Router = express.Router();

router.route("/").get(controller.getAll);
router.route("/single/:categoryID").get(controller.getSingle);
router.route("/create").post(authorization, isAdmin, controller.create);
router
  .route("/remove/:categoryID")
  .delete(authorization, isAdmin, controller.remove);

export default router;
