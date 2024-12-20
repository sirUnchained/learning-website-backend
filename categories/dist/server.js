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
            .connect("mongodb://localhost:27017/microServices-categories")
            .then(() => {
            console.log("mongodb connected.");
        });
        app_1.default.listen(4004, () => {
            console.log("categories service listen on port", 4004);
        });
    }
    catch (error) {
        console.log("we have an error =>", error);
        process.exit(1);
    }
}
start();
