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
app.use("/courses", userRoutes);

app.use((req, res, next) => {
  try {
    console.log("404");
    res.status(404).json({ message: "Route not found" });
    return;
  } catch (error) {
    next(error);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "ValidationError") {
    res.status(400).json({ errors: err.errors });
    return;
  } else if (err.message === "unAuthorization") {
    res.status(401).json({ errors: "pleas sign in or sign up first." });
    return;
  }
  console.log(err);
  res.status(500).json("internal server error => courses service.");
});

export default app;
