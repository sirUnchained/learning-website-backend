import { NextFunction, Request, Response } from "express";

function validator(validator: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validator.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default validator;
