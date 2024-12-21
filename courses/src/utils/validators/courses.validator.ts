import { isValidObjectId } from "mongoose";
import * as yup from "yup";

const createCourseValidator = yup.object({
  title: yup.string().required("title is required."),
  categoryID: yup
    .string()
    .required("category id is required.")
    .test("is-valid-objectid", "category id is not valid.", isValidObjectId),
  // teacherID: yup
  //   .string()
  //   .required("teacher id is required.")
  //   .test("is-valid-objectid", "teacher id is not valid.", isValidObjectId),
  // info: yup.string().required("info is required."),
  description: yup.string().required("description is required."),
  price: yup.string().required("price is required."),
  isFinished: yup.boolean().required("i have to know is it finished or not."),
});

export { createCourseValidator };
