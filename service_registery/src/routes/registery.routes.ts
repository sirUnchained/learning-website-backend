import { FastifyInstance, FastifyPluginOptions } from "fastify";

import ServiceRegistery from "../controllers/reistery.controller";
const controller = new ServiceRegistery();

import { middleWare1, middleWare2 } from "../middleWare";

function registeryRoutes(
  fastify: FastifyInstance,
  option: FastifyPluginOptions
) {
  fastify.get("/register/:name/:version", controller.get);
  fastify.post(
    "/register/:name/:version/:port",
    { preHandler: [middleWare1, middleWare2] }, // we set a middleWare here
    controller.register
  );
  fastify.delete("/register/:name/:version/:port", controller.unRegister);
}

export default registeryRoutes;
