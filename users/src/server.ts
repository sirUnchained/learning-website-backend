import app from "./app";
import mongoose from "mongoose";
import startRabbit from "./rabbitMQ";

async function start() {
  try {
    await mongoose
      .connect("mongodb://0.0.0.0:27017/microServices-users")
      .then(() => {
        console.log("mongodb connected.");
      });
    app.listen(4001, () => {
      console.log("user service listen on port", 4001);
    });

    await startRabbit();

    await fetch("http://localhost:5000/register/users/1.1.1/4001", {
      method: "POST",
    });
  } catch (error) {
    console.error("error happen:", error);
    await fetch("http://localhost:5000/register/users/1.1.1/4001", {
      method: "DELETE",
    });
    process.exit(1);
  }
}
start();
