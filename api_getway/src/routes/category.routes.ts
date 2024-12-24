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
  fastify.get("/single/:categoryID", getSingle);
  fastify.post("/create", { preHandler: [authorization] }, create);
  fastify.delete(
    "/:categoryID/remove",
    { preHandler: [authorization] },
    remove
  );
}
