import { Router } from "express";
const usersRouter: Router = Router();

import * as controller from "../controllers/users";
import authorization from "../middleWares/auth";
import isAdmin from "../middleWares/isAdmin";

usersRouter.route("/").get(authorization, isAdmin, controller.getUsers);
usersRouter.route("/:userID").get(controller.getSingle);
usersRouter.route("/teachers").get(controller.getTeachers);
usersRouter.route("/getMe").get(authorization, controller.getMe);
usersRouter
  .route("/:userID/ban")
  .post(authorization, isAdmin, controller.banUser);

export default usersRouter;
