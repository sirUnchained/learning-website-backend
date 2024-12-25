import { isValidObjectId } from "mongoose";
import userModel from "../models/User";
import { Request, Response, NextFunction } from "express";

import UsersService from "../services/service";
const usersService = new UsersService();

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await usersService.getAll();

    res.status(data.status).json(data.result);
    return;
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

    const data = await usersService.getSingle(userID);

    res.status(data.status).json(data.user);
    return;
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

    const data = usersService.getMe(currentUser);
    res.status(data.status).json(data.result || "err");
    return;
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
    const data = await usersService.getTeachers();

    res.status(data.status).json(data.result);
    return;
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
    return;
  } catch (error) {
    next(error);
  }
};
