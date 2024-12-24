import { FastifyInstance, FastifyPluginOptions } from "fastify";
import authorization from "../middleWares/auth";
import { getAllTeachers, getAllUsers } from "../services/users.service";

function usersRouter(fastify: FastifyInstance, option: FastifyPluginOptions) {
  fastify.get("/users", { preHandler: [authorization] }, getAllUsers);
  fastify.get("/users/teachers", getAllTeachers);
}

export default usersRouter;
