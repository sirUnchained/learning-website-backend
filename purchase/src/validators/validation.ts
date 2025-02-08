import * as yup from "yup";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const validation = yup.object({
  amount: yup.number().required(),
  courseId: yup.string().matches(objectIdRegex, "Invalid courseId").required(),
  userId: yup.string().matches(objectIdRegex, "Invalid userId").required(),
});

export default validation;
