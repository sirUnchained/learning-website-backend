import { NextFunction, Request, Response } from "express";

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.role !== "ADMIN" && req.user?.role !== "TEACHER") {
      next(new Error("access denied"));
      return;
    }

    next();
  } catch (error) {
    next(new Error("access denied"));
  }
}

export default isAdmin;
