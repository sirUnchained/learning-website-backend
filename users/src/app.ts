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

import userRoutes from "./routes/routes";

app.use("/", userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "ValidationError") {
    res.status(400).json({ errors: err.message });
    return;
  } else if (err.message === "unAuthorization") {
    res.status(401).json({ errors: "pleas sign in or sign up first." });
    return;
  }
  console.log(err);
  res.status(500).json("internal server error => users service.");
});

export default app;
