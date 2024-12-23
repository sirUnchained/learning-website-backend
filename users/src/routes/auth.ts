import { Router } from "express";
const authRouter: Router = Router();

import * as controller from "../controllers/auth";
import registerValidator from "../utils/validators/register";
import validator from "../middleWares/validator";

authRouter
  .route("/register")
  .post(validator(registerValidator), controller.register);
authRouter.route("/login").post(controller.login);

export default authRouter;
