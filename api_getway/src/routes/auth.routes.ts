import { FastifyInstance, FastifyPluginOptions } from "fastify";
import getService from "../utils/getService";
import CircuitBreaker from "../utils/circuitBreaker";

const breaker = new CircuitBreaker();

function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post("/auth/register", async (request, reply) => {
    try {
      const register = await getService("users");
      const result = await breaker.callService({
        method: "POST",
        url: `http://localhost:${register[0].port}/auth/register`,
        data: request.body,
      });
      reply.status(result.status).send(result.data);
      return;
    } catch (error) {
      throw error;
    }
  });
  fastify.post("/auth/login", async (request, reply) => {
    try {
      const register = await getService("users");
      console.log(register);
      const result = await breaker.callService({
        method: "POST",
        url: `http://localhost:${register[0].port}/auth/login`,
        data: request.body,
      });
      reply.status(result.status).send(result.data);
      return;
    } catch (error) {
      throw error;
    }
  });
}

export default authRoutes;
