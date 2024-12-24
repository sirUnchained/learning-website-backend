import { FastifyInstance, FastifyPluginOptions } from "fastify";

function usersRouter(fastify: FastifyInstance, option: FastifyPluginOptions) {
  fastify.get("/users", async (request, reply) => {});
  fastify.get("/users/teachers", async (request, reply) => {});
  // fastify.get("/users/me", async (request, reply) => {});
  fastify.post("/users/login", async (request, reply) => {});
  fastify.post("/users/register", async (request, reply) => {});
}

export default usersRouter;
