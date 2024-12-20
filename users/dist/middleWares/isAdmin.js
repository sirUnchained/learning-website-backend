"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function isAdmin(req, res, next) {
    var _a, _b;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "ADMIN" && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "TEACHER") {
            next(new Error("access denied"));
            return;
        }
        next();
    }
    catch (error) {
        next(new Error("access denied"));
    }
}
exports.default = isAdmin;
