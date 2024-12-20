import { FastifyReply, FastifyRequest } from "fastify";
import * as db from "./../databases/controllers/services.controller";

class ServiceRegistery {
  async register(req: FastifyRequest, reply: FastifyReply) {
    const { name, version, port } = req.params as {
      name: string | undefined;
      version: string | undefined;
      port: string | undefined;
    };

    const ip: string | undefined = req.socket.remoteAddress?.includes("::")
      ? `[${req.socket.remoteAddress}]`
      : req.socket.remoteAddress;

    if (!name || !version || !port || !ip) {
      return false;
    }

    db.insert(name, version, ip, port);

    return reply.status(201).send({ message: "done." });
  }

  async unRegister(req: FastifyRequest, reply: FastifyReply) {
    const { name, version, port } = req.params as {
      name: string | undefined;
      version: string | undefined;
      port: string | undefined;
    };
    const ip: string | undefined = req.socket.remoteAddress?.includes("::")
      ? `[${req.socket.remoteAddress}]`
      : req.socket.remoteAddress;

    if (!name || !version || !port || !ip) {
      return false;
    }

    const key: string = name + version + port + ip;

    db.remove(key);
    return reply.status(200).send({ message: "done." });
  }

  async get(req: FastifyRequest, reply: FastifyReply) {
    const { name, version, port } = req.params as {
      name: string | undefined;
      version: string | undefined;
      port: string | undefined;
    };
    const ip: string | undefined = req.socket.remoteAddress?.includes("::")
      ? `[${req.socket.remoteAddress}]`
      : req.socket.remoteAddress;

    if (!name || !version || !port || !ip) {
      return false;
    }

    const result = db.get(name, version);

    return reply.status(200).send({ result });
  }
}

export default ServiceRegistery;
