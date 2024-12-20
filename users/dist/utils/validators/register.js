"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
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
        .matches(/((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g, "phone number is not valid.")
        .max(250, "maximum character for phone is 250.")
        .required(),
    password: yup
        .string()
        .min(8, "minimum character for password is 8.")
        .max(250, "maximum character for is 250.")
        .required(),
});
exports.default = registerValidator;
