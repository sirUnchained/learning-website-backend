import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getAll,
  getSingle,
  remove,
  create,
} from "../services/category.service";
import authorization from "../middleWares/auth";

export default function categoryRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/categories", getAll);
  // todo
  fastify.post("/create", { preHandler: [authorization] }, create);
  fastify.get("/single/:categoryID", getSingle);
  fastify.delete("/:categoryID/remove", remove);
}
