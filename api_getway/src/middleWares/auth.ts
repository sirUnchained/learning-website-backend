import fastify, { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    token?: string;
  }
}

async function authorization(
  req: FastifyRequest,
  res: FastifyReply,
  done: Function
) {
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split("Bearer ")[1];

    if (!token) {
      res.status(401).send({ error: "Unauthorized." });
      return;
    }

    req.token = token;
    done();
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }
}

export default authorization;
