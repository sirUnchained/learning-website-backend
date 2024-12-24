import mongoose from "mongoose";
import app from "./app";

async function start() {
  try {
    await mongoose
      .connect("mongodb://0.0.0.0:27017/microServices-courses")
      .then(() => {
        console.log("mongodb connected.");
      });
    app.listen(4002, () => {
      console.log("courses service listen on port", 4002);
    });

    await fetch("http://localhost:5000/register/courses/1.1.1/4002", {
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    await fetch("http://localhost:5000/register/courses/1.1.1/4002", {
      method: "POST",
    });
    process.exit(1);
  }
}
start();
