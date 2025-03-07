"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    categoryID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    teacherID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    info: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    cover: {
        type: String,
        required: false,
        default: "",
    },
    isFinished: {
        type: Boolean,
        required: false,
        default: false,
    },
}, {
    timestamps: true,
});
const courseModel = mongoose_1.default.model("courses", schema);
exports.default = courseModel;
