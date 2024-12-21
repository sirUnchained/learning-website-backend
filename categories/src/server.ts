import mongoose from "mongoose";
import app from "./app";

async function start() {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/microServices-categories")
      .then(() => {
        console.log("mongodb connected.");
      });
    app.listen(4004, () => {
      console.log("categories service listen on port", 4004);
    });

    await fetch("http://localhost:5000/register/categories/1.1.1/4004", {
      method: "POST",
    });
  } catch (error) {
    console.log("we have an error =>", error);
    await fetch("http://localhost:5000/register/categories/1.1.1/4004", {
      method: "POST",
    });
    process.exit(1);
  }
}
start();
