import { NextFunction, Request, Response } from "express";
import { callService } from "../rabbitMQ";

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

    const user = (await callService("USER", {
      action: "auth",
      replyServiceName: "course_auth",
      body: { token },
    })) as { status: number; result: UserInterface; token?: string };
    if (user.status != 200) {
      next(new Error("unAuthorization"));
      return;
    }

    user.token = token;
    req.user = user.result;
    next();
  } catch (error) {
    next(new Error("unAuthorization"));
  }
}

export default authorization;
