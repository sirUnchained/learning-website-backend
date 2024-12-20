"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
}));
const routes_1 = __importDefault(require("./routes/routes"));
app.use("/", routes_1.default);
app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        res.status(400).json({ errors: err.message });
        return;
    }
    else if (err.message === "unAuthorization") {
        res.status(401).json({ errors: "pleas sign in or sign up first." });
        return;
    }
    console.log(err);
    res.status(500).json("internal server error => users service.");
});
exports.default = app;
