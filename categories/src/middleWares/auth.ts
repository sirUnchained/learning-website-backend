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

    const result = (await callService({
      action: "auth",
      replyServiceName: "category_auth",
      body: { token: `${token}` },
    })) as { status: number; result: UserInterface; token: string };
    if (result.status != 200) {
      next(new Error("unAuthorization"));
      return;
    }

    result.token = token;
    req.user = result.result;
    next();
  } catch (error) {
    next(new Error("unAuthorization"));
  }
}

export default authorization;
