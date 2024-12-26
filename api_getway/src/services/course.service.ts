import { FastifyReply, FastifyRequest } from "fastify";
import getService from "../utils/getService";
import CircuitBreaker from "../utils/circuitBreaker";
import FormData from "form-data";
import { pipeline } from "node:stream";
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
  const registerApi = await getService("courses");
  const file = await request.file();
  const form = new FormData();

  if (!file) {
  }

  if (file) {
    const filePath = path.join(__dirname, "shit.jpg");
    const fileBuffer = await file.toBuffer();
    fs.writeFileSync(filePath, fileBuffer);
    form.append("cover", fs.createReadStream(filePath), {
      filename: file.filename,
    });

    const fields = file.fields as any;
    for (const field in fields) {
      // console.log(field, fields.hasOwnProperty(field));
      if (fields.hasOwnProperty(field)) {
        // console.log(field, fields[field].value);
        if (fields[field].value) {
          form.append(field, fields[field].value);
        }
      }
    }

    try {
      const result = await breaker.callService({
        method: "POST",
        url: `http://localhost:${registerApi[0].port}/courses/create`,
        headers: {
          Authorization: `Bearer ${request.token}`,
          "Content-Type": "multipart/form-data",
        },
        data: form,
      });
      reply.status(result.status).send(result.data);
    } catch (error) {
      reply.status(500).send({ message: "Error creating course" });
    } finally {
      fs.unlinkSync(filePath);
    }
  }
};
