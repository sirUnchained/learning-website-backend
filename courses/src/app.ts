import express, { Express, NextFunction, Request, Response } from "express";
const app: Express = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(express.static("./../public"));

import cors from "cors";
import helmet from "helmet";
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());

import userRoutes from "./routes/routes";
app.use(userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "ValidationError") {
    res.status(400).json({ errors: err.message });
    return;
  } else if (err.message === "unAuthorization") {
    res.status(401).json({ errors: "pleas sign in or sign up first." });
    return;
  }
  console.log(err);
  res.status(500).json("internal server error => courses service.");
});

export default app;
