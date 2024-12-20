import express, { Express, Request, Response, NextFunction } from "express";
const app: Express = express();
app.use(express.json({ limit: "50mb" }));

import cors from "cors";
import helmet from "helmet";
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

import categoryRoutes from "./routes/routes";
app.use(categoryRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "ValidationError") {
    res.status(400).json({ errors: err.message });
    return;
  } else if (err.message === "unAuthorization") {
    res.status(401).json({ errors: "pleas sign in or sign up first." });
    return;
  }
  console.log(err);
  res.status(500).json("internal server error => category service.");
});

export default app;
