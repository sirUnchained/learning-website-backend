import { NextFunction, Request, Response } from "express";
import courseModel from "../model/model";
import { isValidObjectId } from "mongoose";
import { createCourseValidator } from "../utils/validators/courses.validator";
import { callService } from "../rabbitMQ";
import CourseService from "../services/services";

const courseService = new CourseService();

interface teacherType {
  _id: string;
  fullname: string;
  username: string;
  role?: string;
}
// todo create course services
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await courseService.getAll();

    res.status(result.status).json(result);
    return;
  } catch (error) {
    next(error);
  }
};

export const getSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseID } = req.params;

    const result = await courseService.getSingle(courseID);

    res.status(result.status).json(result);
    return;
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await courseService.create(req);

    res.status(data.status).json(data);
    return;
  } catch (error) {
    next(error);
  }
};

export const removeSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseID } = req.params;

    const data = await courseService.remove(courseID);

    res.status(data.status).json(data);
    return;
  } catch (error) {
    next(error);
  }
};
