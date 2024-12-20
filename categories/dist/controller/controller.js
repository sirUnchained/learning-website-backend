"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.create = exports.getSingle = exports.getAll = void 0;
const model_1 = __importDefault(require("../model/model"));
const mongoose_1 = require("mongoose");
const getAll = async (req, res, next) => {
    try {
        const categories = await model_1.default.find({}).lean();
        res.status(200).json(categories);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getSingle = async (req, res, next) => {
    try {
        const { categoryID } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(categoryID)) {
            res.status(404).json({ msg: "category not found." });
            return;
        }
        const category = await model_1.default.findById(categoryID).lean();
        if (!category) {
            res.status(404).json({ msg: "category not found." });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        next(error);
    }
};
exports.getSingle = getSingle;
const create = async (req, res, next) => {
    try {
        const title = req.body.title;
        const icon = req.body.icon;
        const slug = title === null || title === void 0 ? void 0 : title.trim().replace(/[\s\._]/g, "-");
        if (!slug) {
            res
                .status(409)
                .json({ msg: "category title is not valid or may already exist." });
            return;
        }
        const checkCategory = await model_1.default.findOne({ slug }).lean();
        if (checkCategory) {
            res
                .status(409)
                .json({ msg: "category title is not valid or may already exist." });
            return;
        }
        const category = await model_1.default.create({
            title,
            slug,
            icon: icon || "",
        });
        res.status(201).json(category);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const remove = async (req, res, next) => {
    try {
        const { categoryID } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(categoryID)) {
            res.status(404).json({ msg: "category not found." });
            return;
        }
        const category = await model_1.default.findOneAndDelete({ _id: categoryID });
        if (!category) {
            res.status(404).json({ msg: "category not found." });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
