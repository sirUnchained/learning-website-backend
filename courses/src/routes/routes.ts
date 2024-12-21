import { Router } from "express";
const router: Router = Router();
import * as controller from "./../controller/controller";
import coverUploader from "../utils/uploader";
import authorization from "../middleWares/auth";

const uploader = coverUploader();

router.route("/").get(controller.getAll);
router.route("/single/:courseID").get(controller.getSingle);
router
  .route("/create")
  .post(authorization, uploader.single("cover"), controller.create);
router.route("/remove-single/:courseID").delete(controller.removeSingle);
// router.route("/removeAllCategoryCourses/:categoryID").delete();

export default router;
