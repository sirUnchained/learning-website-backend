import { NextFunction, Request, Response } from "express";

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.user);
    if (req.user?.role !== "ADMIN" && req.user?.role !== "TEACHER") {
      res.status(403).json({ status: 403, result: "access denied." });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default isAdmin;
