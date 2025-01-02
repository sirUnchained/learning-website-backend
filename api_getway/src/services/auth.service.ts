import { FastifyReply, FastifyRequest } from "fastify";
import getService from "../utils/getService";
import CircuitBreaker from "../utils/circuitBreaker";

const breaker = new CircuitBreaker();

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
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
};

export const login = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const register = await getService("users");
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
};
