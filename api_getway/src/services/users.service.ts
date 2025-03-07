import { FastifyReply, FastifyRequest } from "fastify";
import getService from "../utils/getService";
import CircuitBreaker from "../utils/circuitBreaker";
const breaker = new CircuitBreaker();

export const getAllUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const registerApi = await getService("users");
    const result = await breaker.callService({
      method: "GET",
      url: `http://localhost:${registerApi[0].port}/users/`,
      headers: {
        Authorization: `Bearer ${request.token}`,
      },
    });
    reply.status(result.status).send(result.data);
    return;
  } catch (error) {
    throw error;
  }
};

export const getAllTeachers = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const registerApi = await getService("users");
    const result = await breaker.callService({
      method: "GET",
      url: `http://localhost:${registerApi[0].port}/users/teachers`,
    });
    reply.status(result.status).send(result.data);
    return;
  } catch (error) {
    throw error;
  }
};
