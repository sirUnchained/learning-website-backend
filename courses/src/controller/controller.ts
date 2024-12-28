import { NextFunction, Request, Response } from "express";
import courseModel from "../model/model";
import { isValidObjectId } from "mongoose";
import callService from "../other-services";
import { createCourseValidator } from "../utils/validators/courses.validator";

interface teacherType {
  _id: string;
  fullname: string;
  username: string;
  role?: string;
}

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await courseModel.find().lean();

    const teachers: teacherType[] = await callService(
      "users",
      "1.1.1",
      "GET",
      "",
      null
    );
    if (!teachers.length) {
      res.status(404).json({ msg: "no teachers found." });
      return;
    }

    courses.forEach((course, index) => {
      delete course.description;
      teachers.forEach((teacher) => {
        if (course.teacherID?.toString() === teacher._id?.toString()) {
          course.teacher = teacher;
          delete course.teacherID;
        }
      });
    });

    res.status(200).json(courses);
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
    if (!isValidObjectId(courseID)) {
      res.status(404).json({ msg: "course not found." });
      return;
    }

    const course = await courseModel.findById(courseID).lean();
    if (!course) {
      res.status(404).json({ msg: "course not found." });
      return;
    }

    const teacher: teacherType = await callService(
      "users",
      "1.1.1",
      "GET",
      `single/${course.teacher}`,
      null,
      null
    );
    if (teacher.role !== "TEACHER") {
      res.status(404).json({ msg: "for this course teacher not found." });
      return;
    }

    const category = await callService(
      "categories",
      "1.1.1",
      "GET",
      `single/${course.categoryID}`,
      null,
      null
    );
    if (!category) {
      res.status(404).json({ msg: "course category not found." });
      return;
    }

    delete course.categoryID;
    delete course.teacherID;

    res.status(200).json({ ...course, teacher, category });
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
    const category = await callService(
      "categories",
      "1.1.1",
      "GET",
      `single/${categoryID}`,
      null,
      null
    );
    console.log("category", category);
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
