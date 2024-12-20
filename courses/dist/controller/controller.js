"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSingle = exports.create = exports.getSingle = exports.getAll = void 0;
const model_1 = __importDefault(require("../model/model"));
const mongoose_1 = require("mongoose");
const getAll = async (req, res, next) => {
    try {
        const courses = await model_1.default.find().lean();
        const getTeachers = await fetch("http://localhost:4000/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ action: "GET_TEACHERS" }),
        });
        const teachers = await getTeachers.json();
        if (!teachers.length || !getTeachers.ok) {
            res.status(404).json({ msg: "no teachers found." });
            return;
        }
        courses.forEach((course, index) => {
            delete course.description;
            teachers.forEach((teacher) => {
                var _a, _b;
                if (((_a = course.teacherID) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = teacher._id) === null || _b === void 0 ? void 0 : _b.toString())) {
                    course.teacher = teacher;
                    delete course.teacherID;
                }
            });
        });
        res.status(200).json(courses);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getSingle = async (req, res, next) => {
    try {
        const { courseID } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(courseID)) {
            res.status(404).json({ msg: "course not found." });
            return;
        }
        const course = await model_1.default.findById(courseID).lean();
        if (!course) {
            res.status(404).json({ msg: "course not found." });
            return;
        }
        const getTeacher = await fetch(`http://localhost:4000`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ action: "GET_TEACHER", _id: course.teacherID }),
        });
        const teacher = await getTeacher.json();
        if (!getTeacher.ok || teacher.role !== "TEACHER") {
            res.status(404).json({ msg: "for this course teacher not found." });
            return;
        }
        const getCategory = await fetch(`http://localhost:4000/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ action: "GET_CATEGORY", _id: course.categoryID }),
        });
        const category = await getCategory.json();
        if (!category || !getCategory.ok) {
            res.status(404).json({ msg: "course category not found." });
            return;
        }
        delete course.categoryID;
        delete course.teacherID;
        res.status(200).json({ ...course, teacher, category });
    }
    catch (error) {
        next(error);
    }
};
exports.getSingle = getSingle;
const create = async (req, res, next) => {
    var _a;
    try {
        const { title, categoryID, description, price, isFinished } = req.body;
        const currentUser = req.user;
        const slug = title === null || title === void 0 ? void 0 : title.trim().replace(/[\s_\.]/g, "-");
        const checkSlug = await model_1.default.findOne({ slug });
        if (checkSlug) {
            res.status(409).json({ msg: "title already exist." });
            return;
        }
        const getTeacher = await fetch(`http://localhost:4001/single/${currentUser === null || currentUser === void 0 ? void 0 : currentUser._id}`, {
            headers: {
                authorization: `Bearer ${currentUser === null || currentUser === void 0 ? void 0 : currentUser.token}`,
            },
        });
        const checkTeacher = await getTeacher.json();
        if (!checkTeacher ||
            !getTeacher.ok ||
            checkTeacher.role !== "TEACHER" ||
            checkTeacher.role !== "ADMIN") {
            res.status(404).json({ msg: "teacher not found." });
            return;
        }
        const getCategory = await fetch(`http://localhost:4000/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ action: "GET_CATEGORY", _id: categoryID }),
        });
        const checkCategory = await getCategory.json();
        if (!checkCategory || !getCategory.ok) {
            res.status(404).json({ msg: "category not found." });
            return;
        }
        const cover = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path.replace(/.*public\\/g, "").replace(/\\/g, "/");
        const newCourse = new model_1.default({
            title,
            slug,
            categoryID,
            teacherID: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id,
            cover,
            description,
            price,
            isFinished: isFinished || false,
        });
        await newCourse.save();
        res.status(200).json({ msg: "course created." });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const removeSingle = async (req, res, next) => {
    try {
        const { courseID } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(courseID)) {
            res.status(404).json({ msg: "course not found." });
            return;
        }
        const removedCourse = await model_1.default.findByIdAndDelete(courseID).lean();
        if (!removedCourse) {
            res.status(404).json({ msg: "course not found." });
            return;
        }
        res.status(200).json({ msg: "course removed !." });
    }
    catch (error) {
        next(error);
    }
};
exports.removeSingle = removeSingle;
