import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getCourses } from "../services/course.service";

export default function courseRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/courses", getCourses);
}
