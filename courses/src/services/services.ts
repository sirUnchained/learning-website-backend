import { isValidObjectId } from "mongoose";
import courseModel from "../model/model";
import { callService } from "../rabbitMQ";
import { Request } from "express";
import { createCourseValidator } from "../utils/validators/courses.validator";

interface teacherType {
  _id: string;
  fullname: string;
  username: string;
  role?: string;
}

class CourseService {
  public getAll = async () => {
    try {
      const courses = await courseModel.find().lean();

      const recivedTeachers: { status: Number; result: teacherType[] } =
        await callService("USER", {
          action: "getTeachers",
          replyServiceName: "course_teachers",
          body: null,
        });
      if (!recivedTeachers.result?.length) {
        return { status: 404, result: "no teachers found." };
      }

      courses.forEach((course) => {
        delete course.description;
        recivedTeachers.result.forEach((teacher) => {
          if (course.teacherID?.toString() === teacher._id?.toString()) {
            course.teacher = teacher;
            delete course.teacherID;
          }
        });
      });

      return { status: 200, result: courses };
    } catch (error: any) {
      return { status: 500, result: error.message };
    }
  };

  public getSingle = async (courseID: string) => {
    try {
      if (!isValidObjectId(courseID)) {
        return { status: 404, result: "course not found." };
      }

      const course = await courseModel.findById(courseID).lean();
      if (!course) {
        return { status: 404, result: "course not found." };
      }

      const teacher: teacherType = await callService("USER", {
        action: "auth",
        replyServiceName: "getSingle",
        body: { id: course.teacherID },
      });
      if (teacher.role !== "TEACHER") {
        return { status: 404, result: "for this course teacher not found." };
      }

      const category = await callService("CATEGORY", {
        action: "getAll",
        replyServiceName: "course_categories",
      });
      if (!category) {
        return { status: 404, result: "course category not found." };
      }

      delete course.categoryID;
      delete course.teacherID;

      return { status: 200, result: { ...course, teacher, category } };
    } catch (error: any) {
      return { status: 500, result: error.message };
    }
  };

  public create = async (req: Request) => {
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
        return { status: 409, result: "title already exists." };
      }

      if (!currentUser || !currentUser.role) {
        return { status: 400, result: "you are not recognized." };
      }
      if (currentUser.role !== "TEACHER" && currentUser.role !== "ADMIN") {
        return { status: 404, result: "teacher not found." };
      }

      if (!isValidObjectId(categoryID)) {
        return { status: 404, result: "category not found." };
      }

      const category = await callService("CATEGORY", {
        action: "getSingle",
        replyServiceName: "course_check_category",
        body: {
          id: categoryID,
        },
      });
      if (!category) {
        return { status: 404, result: "category not found." };
      }

      const cover = req.file?.path
        .replace(/.*public\\/g, "")
        .replace(/\\/g, "/");

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

      return { status: 201, result: "course created." };
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return { status: 400, result: error.errors };
      }
      return { status: 500, result: error.message };
    }
  };

  public remove = async (courseID: string) => {
    if (!isValidObjectId(courseID)) {
      return { status: 404, result: "course not found." };
    }

    const removedCourse = await courseModel.findByIdAndDelete(courseID).lean();
    if (!removedCourse) {
      return { status: 404, result: "course not found." };
    }

    return { status: 200, result: "course removed successfully." };
  };
}

export default CourseService;
