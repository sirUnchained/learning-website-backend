import { FastifyReply, FastifyRequest } from "fastify";
import getService from "../utils/getService";
import CircuitBreaker from "../utils/circuitBreaker";
import FormData from "form-data";
import { pipeline } from "node:stream";
import fs from "node:fs";
const breaker = new CircuitBreaker();

declare module "fastify" {
  interface FastifyRequest {
    fields?: any;
    multipart: any;
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
  const registerApi = await getService("courses");
  const file = await request.file();
  const form = new FormData();

  if (file) {
    // append files to frm data
    form.append("cover", await file.toBuffer());
    const fields = file.fields;
    for (const field in fields) {
      if (fields.hasOwnProperty(field)) {
        form.append(field, `${fields[field]}`);
      }
    }

    const result = await breaker.callService({
      method: "POST",
      url: `http://localhost:${registerApi[0].port}/courses/create`,
      headers: {
        Authorization: `Bearer ${request.token}`,
        ...form.getHeaders(),
      },
      data: form,
    });
    reply.status(result.status).send(result.data);
    return;
  }
};
