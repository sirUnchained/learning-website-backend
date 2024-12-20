import { NextFunction, Request, Response } from "express";
import courseModel from "../model/model";
import { isValidObjectId } from "mongoose";

interface errorType {
  error: string;
}
interface teacherType {
  _id: string;
  fullname: string;
  username: string;
  role?: string;
}
interface courseType {
  _id?: string;
  title: string;
  slug: string;
  categoryID: string;
  teacherID: string;
  description?: String;
  price: Number;
  cover?: String;
}

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await courseModel.find().lean();
    const getTeachers = await fetch("http://localhost:4000/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ action: "GET_TEACHERS" }),
    });
    const teachers: teacherType[] = await getTeachers.json();
    if (!teachers.length || !getTeachers.ok) {
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

    const getTeacher = await fetch(`http://localhost:4000`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ action: "GET_TEACHER", _id: course.teacherID }),
    });
    const teacher: teacherType = await getTeacher.json();
    if (!getTeacher.ok || teacher.role !== "TEACHER") {
      res.status(404).json({ msg: "for this course teacher not found." });
      return;
    }

    const getCategory = await fetch(`http://localhost:4000/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ action: "GET_CATEGORY", _id: course.categoryID }),
    });
    const category = await getCategory.json();
    if (!category || !getCategory.ok) {
      res.status(404).json({ msg: "course category not found." });
      return;
    }

    delete course.categoryID;
    delete course.teacherID;

    res.status(200).json({ ...course, teacher, category });
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
    const currentUser = req.user;
    const slug = title?.trim().replace(/[\s_\.]/g, "-");

    const checkSlug = await courseModel.findOne({ slug });
    if (checkSlug) {
      res.status(409).json({ msg: "title already exist." });
      return;
    }

    const getTeacher = await fetch(
      `http://localhost:4001/single/${currentUser?._id}`,
      {
        headers: {
          authorization: `Bearer ${currentUser?.token}`,
        },
      }
    );
    const checkTeacher = await getTeacher.json();
    if (
      !checkTeacher ||
      !getTeacher.ok ||
      checkTeacher.role !== "TEACHER" ||
      checkTeacher.role !== "ADMIN"
    ) {
      res.status(404).json({ msg: "teacher not found." });
      return;
    }

    const getCategory = await fetch(`http://localhost:4000/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ action: "GET_CATEGORY", _id: categoryID }),
    });
    const checkCategory = await getCategory.json();
    if (!checkCategory || !getCategory.ok) {
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
      price,
      isFinished: isFinished || false,
    });
    await newCourse.save();

    res.status(200).json({ msg: "course created." });
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
  } catch (error) {
    next(error);
  }
};
