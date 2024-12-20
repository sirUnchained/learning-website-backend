// import userModel from "./../models/User";
import { NextFunction, Request, Response, Express } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserInterface {
  _id?: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  role?: "ADMIN" | "USER" | "TEACHER";
  token?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface;
    }
  }
}

async function authorization(req: Request, res: Response, next: NextFunction) {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      next(new Error("unAuthorization"));
      return;
    }

    const token: string | undefined = bearerToken?.split("Bearer ")[1];
    if (!token) {
      next(new Error("unAuthorization"));
      return;
    }

    const payLoad: JwtPayload | string = jwt.verify(
      token,
      "shhh_iTs_SeCrET_KeY"
    );
    let user: any;
    if (typeof payLoad === "object") {
      user = await fetch("http://localhost:4001/getMe", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      user = await user.json();
      delete user?.password;
      user.token = token;
    } else {
      next(new Error("unAuthorization"));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(new Error("unAuthorization"));
  }
}

export default authorization;
