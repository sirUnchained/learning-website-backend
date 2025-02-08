import userModel from "./../models/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface UserInterface {
  _id?: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role?: "ADMIN" | "USER" | "TEACHER";
}

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
      { username: newUserData.username, _id: newUserData._id },
      "shhh_iTs_SeCrET_KeY",
      {
        expiresIn: "10d",
      }
    );

    res.status(201).json({ token });
    return;
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
      username,
    });
    if (!checkUser) {
      res.status(404).json({ msg: "invalid username." });
      return;
    }

    const isPassWordValid: boolean = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!isPassWordValid) {
      res.status(404).json({ msg: "invalid password." });
      return;
    }

    const token = jwt.sign(
      { username, _id: checkUser._id },
      "shhh_iTs_SeCrET_KeY",
      {
        expiresIn: "10d",
      }
    );

    res.status(200).json({ token });
    return;
  } catch (error) {
    next(error);
  }
};
