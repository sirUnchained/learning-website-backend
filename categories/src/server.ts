import mongoose from "mongoose";
import app from "./app";

import { startRabbit } from "./rabbitMQ";
import configs from "./config_env";

async function start() {
  try {
    await mongoose.connect(configs.mongoUri).then(() => {
      console.log("mongodb connected.");
    });
    app.listen(4003, () => {
      console.log("categories service listen on port", 4003);
    });

    await startRabbit();

    await fetch("http://localhost:5000/register/categories/1.1.1/4003", {
      method: "POST",
    });
  } catch (error) {
    console.log("we have an error =>", error);
    await fetch("http://localhost:5000/register/categories/1.1.1/4003", {
      method: "POST",
    });
    process.exit(1);
  }
}
start();
