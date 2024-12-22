import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import callService from "../other-services";

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
      user = await callService(
        "users",
        "1.1.1",
        "GET",
        payLoad._id.toString(),
        null,
        {
          authorization: `Bearer ${token}`,
        }
      );

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
