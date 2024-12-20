"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function authorization(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            next(new Error("unAuthorization"));
            return;
        }
        const token = bearerToken === null || bearerToken === void 0 ? void 0 : bearerToken.split("Bearer ")[1];
        if (!token) {
            next(new Error("unAuthorization"));
            return;
        }
        const payLoad = jsonwebtoken_1.default.verify(token, "shhh_iTs_SeCrET_KeY");
        let user;
        if (typeof payLoad === "object") {
            user = await User_1.default.findOne({ username: payLoad === null || payLoad === void 0 ? void 0 : payLoad.username }).lean();
            user === null || user === void 0 ? true : delete user.password;
            user.token = token;
        }
        else {
            next(new Error("unAuthorization"));
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new Error("unAuthorization"));
    }
}
exports.default = authorization;
