import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getCourses, newCourse } from "../services/course.service";
import authorization from "../middleWares/auth";

export default function courseRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/courses", getCourses);
  fastify.post("/courses/new", { preHandler: [authorization] }, newCourse);
}
