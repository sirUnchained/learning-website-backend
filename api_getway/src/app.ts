import fastify from "fastify";
const app = fastify();

import usersRouter from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";

app.register(authRoutes);
app.register(usersRouter);
app.register(categoryRoutes);

app.setErrorHandler((err, req, reply) => {
  reply.code(err.statusCode || 500).send({ message: err.message });
});

export default app;
