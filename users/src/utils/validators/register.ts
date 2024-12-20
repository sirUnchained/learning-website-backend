import * as yup from "yup";

const registerValidator = yup.object({
  fullname: yup
    .string()
    .min(5, "full name minimum character is 5")
    .max(100, "maximum character for full name is 100.")
    .required(),
  username: yup
    .string()
    .min(5, "user name minimum character is 5")
    .max(100, "maximum character for user name is 100.")
    .required(),
  email: yup
    .string()
    .email()
    .max(250, "maximum character for email is 250.")
    .required(),
  phone: yup
    .string()
    .matches(
      /((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g,
      "phone number is not valid."
    )
    .max(250, "maximum character for phone is 250.")
    .required(),
  password: yup
    .string()
    .min(8, "minimum character for password is 8.")
    .max(250, "maximum character for is 250.")
    .required(),
});

export default registerValidator;
