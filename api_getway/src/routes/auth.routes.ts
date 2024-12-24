import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { login, register } from "../services/auth.service";

function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post("/auth/register", register);
  fastify.post("/auth/login", login);
}

export default authRoutes;
