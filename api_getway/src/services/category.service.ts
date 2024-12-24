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
    const apiRegister = await getService("categories");
    const { categoryID } = request.params as { categoryID: string };
    const result = await breaker.callService({
      method: "GET",
      url: `http://localhost:${apiRegister[0].port}/categories/${categoryID}`,
    });

    reply.status(result.status).send(result.data);
    return;
  } catch (error) {
    throw error;
  }
};

export const remove = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const apiRegister = await getService("categories");
    const { categoryID } = request.params as { categoryID: string };
    const result = await breaker.callService({
      method: "DELETE",
      url: `http://localhost:${apiRegister[0].port}/categories/${categoryID}`,
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

export const create = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const apiRegister = await getService("categories");
    const { name } = request.body as { name: string };
    const result = await breaker.callService({
      method: "POST",
      url: `http://localhost:${apiRegister[0].port}/categories`,
      headers: {
        Authorization: `Bearer ${request.token}`,
      },
      data: { name },
    });

    reply.status(result.status).send(result.data);
    return;
  } catch (error) {
    throw error;
  }
};
