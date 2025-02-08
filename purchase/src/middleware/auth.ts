import { NextFunction, Request, Response } from "express";
import { callService } from "../rabbitMQ";

declare module "express" {
  interface Request {
    user?: any;
  }
}

async function authorization(req: Request, res: Response, next: NextFunction) {
  try {
    const bearerToken = req.headers["authorization"]?.split(" ")[1];
    if (!bearerToken) {
      console.log(bearerToken);
      throw new Error("token is not valid !");
    }

    const data = (await callService("USER", {
      action: "auth",
      replyServiceName: "purchase_user",
      body: { token: bearerToken },
    })) as { status: Number; result: any } | undefined;
    if (!data?.result || data.status != 200) {
      console.log("get in auth.ts purchase service");
      throw new Error("user not found !");
    }

    req.user = data.result;

    next();
    return;
  } catch (error: any) {
    res.status(401).json({ status: 400, result: error.message });
    return;
  }
}

export default authorization;
