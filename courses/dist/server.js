"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
async function start() {
    try {
        await mongoose_1.default
            .connect("mongodb://localhost:27017/microServices-courses")
            .then(() => {
            console.log("mongodb connected.");
        });
        app_1.default.listen(4002, () => {
            console.log("courses service listen on port", 4002);
        });
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
start();
