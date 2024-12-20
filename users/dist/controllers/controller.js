"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.banUser = exports.login = exports.register = exports.getTeachers = exports.getMe = exports.getSingle = exports.getUsers = void 0;
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("./../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsers = async (req, res, next) => {
    try {
        const users = await User_1.default
            .find({})
            .sort({ _id: -1 })
            .select("fullname username phone email role")
            .lean();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const getSingle = async (req, res, next) => {
    try {
        const { userID } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(userID)) {
            res.status(404).json({ msg: "user not found." });
            return;
        }
        const user = await User_1.default
            .findById(userID)
            .select("fullname username role")
            .lean();
        if (!user) {
            res.status(404).json({ msg: "user not found." });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getSingle = getSingle;
const getMe = async (req, res, next) => {
    try {
        const currentUser = req.user;
        if (!currentUser) {
            res.status(404).json({ msg: "pleas sign in or sign up first." });
            return;
        }
        res.status(200).json(currentUser);
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const getTeachers = async (req, res, next) => {
    try {
        const teachers = await User_1.default
            .find({ role: "TEACHER" })
            .select("fullname username _id role")
            .lean();
        res.status(200).json(teachers);
    }
    catch (error) {
        next(error);
    }
};
exports.getTeachers = getTeachers;
const register = async (req, res, next) => {
    try {
        const newUserData = req.body;
        const checkUsername = await User_1.default.findOne({
            $or: [
                { username: newUserData.username },
                { phone: newUserData.phone },
                { email: newUserData.email },
            ],
        });
        if (checkUsername) {
            res.status(409).json({
                msg: "datas are duplicated, check phone email and username again.",
            });
            return;
        }
        const usersCount = await User_1.default.countDocuments();
        const hashedPassword = await bcryptjs_1.default.hash(newUserData.password, 15);
        const newUser = new User_1.default({
            fullname: newUserData.fullname,
            username: newUserData.username,
            email: newUserData.email,
            phone: newUserData.phone,
            password: hashedPassword,
            role: usersCount === 0 ? "ADMIN" : "USER",
        });
        await newUser.save();
        const token = jsonwebtoken_1.default.sign({ username: newUserData.username }, "shhh_iTs_SeCrET_KeY", {
            expiresIn: "1d",
        });
        res.status(201).json({ token });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const checkUser = await User_1.default.findOne({
            username: username,
        });
        if (!checkUser) {
            res.status(404).json({ msg: "invalid username or password." });
            return;
        }
        const isPassWordValid = await bcryptjs_1.default.compare(password, checkUser.password);
        if (!isPassWordValid) {
            res.status(404).json({ msg: "invalid username or password." });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ username }, "shhh_iTs_SeCrET_KeY", {
            expiresIn: "1d",
        });
        res.status(200).json({ token });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const banUser = async (req, res, next) => {
    try {
        const { userID } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(userID)) {
            res.status(404).json({ msg: "user not found." });
            return;
        }
        const bannedUser = await User_1.default.findOneAndDelete({ _id: userID });
        if (!bannedUser) {
            res.status(404).json({ msg: "user not found." });
            return;
        }
        res.status(200).json({ msg: "user banned." });
    }
    catch (error) {
        next(error);
    }
};
exports.banUser = banUser;
