import express, { Request, Response, NextFunction, Express } from "express";
const app: Express = express();

import helmet from "helmet";
import cors from "cors";

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

import usersRouter from "./routes/users";
import authRouter from "./routes/auth";

app.use("/user", usersRouter);
app.use("/auth", authRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "ValidationError") {
    res.status(400).json({ errors: err.errors });
    return;
  } else if (err.message === "unAuthorization") {
    res.status(401).json({ errors: "pleas sign in or sign up first." });
    return;
  }
  console.log(err);
  res.status(500).json("internal server error => users service.");
});

export default app;
