"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
async function start() {
    try {
        await mongoose_1.default
            .connect("mongodb://localhost:27017/microServices-users")
            .then(() => {
            console.log("mongodb connected.");
        });
        app_1.default.listen(4001, () => {
            console.log("user service listen on port", 4001);
        });
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
start();
