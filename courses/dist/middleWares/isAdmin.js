"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function isAdmin(req, res, next) {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "ADMIN") {
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
