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
    const { title, categoryID, description, price, isFinished } = req.body;
    await createCourseValidator.validate(
      { title, categoryID, description, price, isFinished },
      { abortEarly: false }
    );

    const currentUser = req.user;
    const slug = title?.trim().replace(/[\s-\.]/g, "-");

    const checkSlug = await courseModel.findOne({ slug });
    if (checkSlug) {
      res.status(409).json({ msg: "title already exist." });
      return;
    }

    if (!currentUser || !currentUser.role) {
      res.status(400).json({ msg: "you are not reconized." });
      return;
    }
    if (currentUser.role !== "TEACHER" && currentUser.role !== "ADMIN") {
      res.status(404).json({ msg: "teacher not found." });
      return;
    }

    if (!isValidObjectId(categoryID)) {
      res.status(404).json({ msg: "category not found." });
      return;
    }

    const category = await callService("CATEGORY", {
      action: "getSingle",
      replyServiceName: "course_check_category",
      body: {
        id: categoryID,
      },
    });
    if (!category) {
      res.status(404).json({ msg: "category not found." });
      return;
    }

    const cover = req.file?.path.replace(/.*public\\/g, "").replace(/\\/g, "/");

    const newCourse = new courseModel({
      title,
      slug,
      categoryID,
      teacherID: currentUser?._id,
      cover,
      description,
      info: description.slice(0, 200),
      price,
      isFinished: isFinished || false,
    });
    await newCourse.save();

    res.status(201).json({ msg: "course created." });
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
    if (!isValidObjectId(courseID)) {
      res.status(404).json({ msg: "course not found." });
      return;
    }

    const removedCourse = await courseModel.findByIdAndDelete(courseID).lean();
    if (!removedCourse) {
      res.status(404).json({ msg: "course not found." });
      return;
    }

    res.status(200).json({ msg: "course removed !." });
    return;
  } catch (error) {
    next(error);
  }
};
