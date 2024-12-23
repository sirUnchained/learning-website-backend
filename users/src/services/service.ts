import { isValidObjectId } from "mongoose";
import userModel from "./../models/User";
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

class UsersService {
  async getAll() {
    const users = await userModel
      .find({})
      .sort({ createdAt: "desc" })
      .select("fullname username phone email role")
      .lean();

    return { result: users, status: 200 };
  }

  async getSingle(userID: string): Promise<any> {
    if (!isValidObjectId(userID)) {
      return { result: "user not found.", status: 404 };
    }

    const user = await userModel
      .findById(userID)
      .select("fullname username role")
      .lean();
    if (!user) {
      return { result: "user not found.", status: 404 };
    }

    return { result: user, status: 200 };
  }

  getMe(currentUser: any) {
    if (!currentUser) {
      return { result: "you are not authorized.", status: 401 };
    }

    return { result: currentUser, status: 200 };
  }

  async getTeachers() {
    const teachers = await userModel
      .find({ role: "TEACHER" })
      .select("fullname username _id role")
      .lean();

    return { result: teachers, status: 200 };
  }
}

export default UsersService;
