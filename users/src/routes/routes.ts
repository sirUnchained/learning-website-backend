import { Router } from "express";
const router: Router = Router();

import * as controller from "./../controllers/controller";
import registerValidator from "../utils/validators/register";
import validator from "../middleWares/validator";
import authorization from "../middleWares/auth";
import isAdmin from "../middleWares/isAdmin";

router.route("/").get(authorization, isAdmin, controller.getUsers);
router.route("/teachers").get(controller.getTeachers);
router.route("/single/:userID").get(controller.getSingle);
router.route("/getMe").get(authorization, controller.getMe);
router
  .route("/register")
  .post(validator(registerValidator), controller.register);
router.route("/login").post(controller.login);
router.route("/ban/:userID").post(authorization, isAdmin, controller.banUser);

export default router;
