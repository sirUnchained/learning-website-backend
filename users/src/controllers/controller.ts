import { isValidObjectId } from "mongoose";
import userModel from "./../models/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import callService from "../utils/other-services";

interface UserInterface {
  _id?: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role?: "ADMIN" | "USER" | "TEACHER";
}

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userModel
      .find({})
      .sort({ _id: -1 })
      .select("fullname username phone email role")
      .lean();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userID } = req.params;
    if (!isValidObjectId(userID)) {
      res.status(404).json({ msg: "user not found." });
      return;
    }

    const user = await userModel
      .findById(userID)
      .select("fullname username role")
      .lean();
    if (!user) {
      res.status(404).json({ msg: "user not found." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      res.status(404).json({ msg: "pleas sign in or sign up first." });
      return;
    }

    res.status(200).json(currentUser);
  } catch (error) {
    next(error);
  }
};

export const getTeachers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teachers = await userModel
      .find({ role: "TEACHER" })
      .select("fullname username _id role")
      .lean();

    const courses = await callService(
      "courses",
      "1.1.1",
      "GET",
      "course",
      null
    );

    res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUserData: UserInterface = req.body;

    const checkUsername = await userModel.findOne({
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

    const usersCount: number = await userModel.countDocuments();

    const hashedPassword: string = await bcrypt.hash(newUserData.password, 15);

    const newUser = new userModel({
      fullname: newUserData.fullname,
      username: newUserData.username,
      email: newUserData.email,
      phone: newUserData.phone,
      password: hashedPassword,
      role: usersCount === 0 ? "ADMIN" : "USER",
    });
    await newUser.save();

    const token = jwt.sign(
      { username: newUserData.username },
      "shhh_iTs_SeCrET_KeY",
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const checkUser: UserInterface | null = await userModel.findOne({
      username: username,
    });
    if (!checkUser) {
      res.status(404).json({ msg: "invalid username or password." });
      return;
    }

    const isPassWordValid: boolean = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!isPassWordValid) {
      res.status(404).json({ msg: "invalid username or password." });
      return;
    }

    const token = jwt.sign({ username }, "shhh_iTs_SeCrET_KeY", {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userID } = req.params;
    if (!isValidObjectId(userID)) {
      res.status(404).json({ msg: "user not found." });
      return;
    }

    const bannedUser = await userModel.findOneAndDelete({ _id: userID });
    if (!bannedUser) {
      res.status(404).json({ msg: "user not found." });
      return;
    }

    res.status(200).json({ msg: "user banned." });
  } catch (error) {
    next(error);
  }
};
