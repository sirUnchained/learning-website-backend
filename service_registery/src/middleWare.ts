import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export function middleWare1(
  req: FastifyRequest,
  res: FastifyReply,
  done: HookHandlerDoneFunction
) {
  try {
    console.log("middle ware 1", req.params);
    done();
  } catch (error: any) {
    console.log("error =>", error);
    done(error);
  }
}

export function middleWare2(
  req: FastifyRequest,
  res: FastifyReply,
  done: HookHandlerDoneFunction
) {
  try {
    console.log("middle ware 2", req.params);
    done();
  } catch (error: any) {
    console.log("error =>", error);
    done(error);
  }
}
