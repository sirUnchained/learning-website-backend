import { FastifyReply, FastifyRequest } from "fastify";
import getService from "../utils/getService";
import CircuitBreaker from "../utils/circuitBreaker";
import FormData from "form-data";
import fs from "node:fs";
import path from "node:path";
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
  const body: any = request.body;
  const registerApi = await getService("courses");

  if (body.cover && body.cover._buf) {
    const form = new FormData();

    for (const item in body) {
      if (!body[item]._buf) {
        form.append(item, body[item].value);
      }
    }

    const filePath = path.join(__dirname, "temp.jpg");
    const fileBuffer = body.cover._buf;
    fs.writeFileSync(filePath, fileBuffer);
    form.append("cover", fs.readFileSync(filePath), {
      filename: body.cover.filename,
    });

    try {
      const result = await breaker.callService({
        method: "POST",
        url: `http://localhost:${registerApi[0].port}/courses/create`,
        headers: {
          Authorization: `Bearer ${request.token}`,
          ...form.getHeaders(),
        },
        data: form,
      });
      await reply.status(result.status).send(result.data);
    } catch (error) {
      await reply.status(500).send({ message: "Error creating course" });
    } finally {
      fs.unlinkSync(filePath);
    }
  } else if (request.multipart) {
    const form = new FormData();
    for (const field in request.fields) {
      form.append(field, request.fields[field]);
    }
    form.append("cover", request.multipart.file);

    try {
      const result = await breaker.callService({
        method: "POST",
        url: `http://localhost:${registerApi[0].port}/courses/create`,
        headers: {
          Authorization: `Bearer ${request.token}`,
          ...form.getHeaders(),
        },
        data: form,
      });
      await reply.status(result.status).send(result.data);
    } catch (error) {
      await reply.status(500).send({ message: "Error creating course" });
    }
  } else {
    await reply.status(400).send({ msg: "you sent no file." });
  }
};
