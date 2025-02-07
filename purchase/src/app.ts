import express from "express";
const app = express();

import purchaseRoutes from "./routes/purchase";
import limit from "express-rate-limit";
import helmet from "helmet";

app.use(helmet());
// app.use(limit({}));

app.use("/purchase", purchaseRoutes);

export default app;
