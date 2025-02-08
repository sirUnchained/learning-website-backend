import { isValidObjectId } from "mongoose";
import courseModel from "../model/model";
import { callService } from "../rabbitMQ";

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

      const teachers: teacherType[] = await callService("USER", {
        action: "getTeachers",
        replyServiceName: "course_teachers",
        body: null,
      });
      if (!teachers.length) {
        return { status: 404, result: "no teachers found." };
      }

      courses.forEach((course) => {
        delete course.description;
        teachers.forEach((teacher) => {
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
}

export default CourseService;
