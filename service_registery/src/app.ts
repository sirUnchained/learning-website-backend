import fastify, { FastifyInstance } from "fastify";
const app: FastifyInstance = fastify({ logger: false });

import registeryRoutes from "./routes/registery.routes";
app.register(registeryRoutes);

export default app;
