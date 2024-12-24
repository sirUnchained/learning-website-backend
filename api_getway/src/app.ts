import fastify from "fastify";
const app = fastify();

import usersRouter from "./routes/users.routes";
app.register(usersRouter);

export default app;
