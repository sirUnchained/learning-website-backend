import { FastifyInstance, FastifyPluginOptions } from "fastify";
import getService from "../utils/getService";
import CircuitBreaker from "../utils/circuitBreaker";
import authorization from "../middleWares/auth";

const breaker = new CircuitBreaker();

function usersRouter(fastify: FastifyInstance, option: FastifyPluginOptions) {
  fastify.get(
    "/users",
    { preHandler: [authorization] },
    async (request, reply) => {
      try {
        const register = await getService("users");
        const result = await breaker.callService({
          method: "GET",
          url: `http://localhost:${register[0].port}/users/`,
          headers: {
            Authorization: `Bearer ${request.token}`,
          },
        });
        reply.status(result.status).send(result.data);
        return;
      } catch (error) {
        throw error;
      }
    }
  );
  fastify.get("/users/teachers", async (request, reply) => {});
  // fastify.get("/users/me", async (request, reply) => {});
  fastify.post("/users/login", async (request, reply) => {});
  fastify.post("/users/register", async (request, reply) => {});
}

export default usersRouter;
