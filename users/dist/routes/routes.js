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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controller = __importStar(require("./../controllers/controller"));
const register_1 = __importDefault(require("../utils/validators/register"));
const validator_1 = __importDefault(require("../middleWares/validator"));
const auth_1 = __importDefault(require("../middleWares/auth"));
const isAdmin_1 = __importDefault(require("../middleWares/isAdmin"));
router.route("/").get(auth_1.default, isAdmin_1.default, controller.getUsers);
router.route("/teachers").get(controller.getTeachers);
router
    .route("/single/:userID")
    .get(controller.getSingle);
router.route("/getMe").get(auth_1.default, controller.getMe);
router
    .route("/register")
    .post((0, validator_1.default)(register_1.default), controller.register);
router.route("/login").post(controller.login);
router.route("/ban/:userID").post(auth_1.default, isAdmin_1.default, controller.banUser);
exports.default = router;
