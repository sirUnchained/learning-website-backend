import { FastifyReply, FastifyRequest } from "fastify";
import getService from "../utils/getService";
import CircuitBreaker from "../utils/circuitBreaker";
const breaker = new CircuitBreaker();

export const getAll = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const apiRegister = await getService("categories");
    const result = await breaker.callService({
      method: "GET",
      url: `http://localhost:${apiRegister[0].port}/categories`,
    });

    reply.status(result.status).send(result.data);
    return;
  } catch (error) {
    throw error;
  }
};

export const getSingle = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // todo
  } catch (error) {
    throw error;
  }
};

export const remove = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // todo
  } catch (error) {
    throw error;
  }
};

export const create = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // todo
  } catch (error) {
    throw error;
  }
};
