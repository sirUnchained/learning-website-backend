import fastify from "fastify";
const app = fastify();

import fastifyMultipart from "@fastify/multipart";
app.register(fastifyMultipart, {
  attachFieldsToBody: true,
  limits: {
    fileSize: 1024 * 1024,
  },
});

import usersRouter from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import courseRoutes from "./routes/course.routes";

app.register(authRoutes);
app.register(usersRouter);
app.register(categoryRoutes);
app.register(courseRoutes);

app.setErrorHandler((err, req, reply) => {
  console.log(err);
  reply.code(err.statusCode || 500).send({ message: err.message });
});

export default app;
