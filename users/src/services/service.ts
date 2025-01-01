import { isValidObjectId } from "mongoose";
import userModel from "./../models/User";
import jwt from "jsonwebtoken";

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

  async getMe(currentUser: any) {
    try {
      const payload = jwt.verify(currentUser.token, "shhh_iTs_SeCrET_KeY") as {
        _id: string;
        username: string;
      };
      console.log(payload);

      const user = await userModel.findById(
        payload._id,
        "fullname username role"
      );
      if (!user) {
        return { status: 404, result: "user not found." };
      }

      return { result: user, status: 200 };
    } catch (error) {
      return { result: "you are not authorized.", status: 401 };
    }
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
