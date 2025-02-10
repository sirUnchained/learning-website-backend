import express, { NextFunction, Request, Response } from "express";
const app = express();
app.use(express.json());

import purchaseRoutes from "./routes/purchase";
import limit from "express-rate-limit";
import helmet from "helmet";

app.use(helmet());
// app.use(limit({}));

app.use("/purchase", purchaseRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ result: 404, data: "route not found." });
  return;
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ result: 500, data: "internal server error." });
  return;
});

export default app;
