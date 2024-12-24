import { FastifyReply, FastifyRequest } from "fastify";
import getService from "../utils/getService";
import CircuitBreaker from "../utils/circuitBreaker";
const breaker = new CircuitBreaker();

declare module "fastify" {
  interface FastifyRequest {
    fields?: any;
  }
}

export const getCourses = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const registerApi = await getService("courses");
    const result = await breaker.callService({
      method: "GET",
      url: `http://localhost:${registerApi[0].port}/courses`,
    });
    reply.status(result.status).send(result.data);
    return;
  } catch (error) {
    throw error;
  }
};

export const newCourse = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  console.log((await request.file())?.fields);
  // console.log(await request.file());
  // reply.status(200).send(request.fields);
  return;
};
