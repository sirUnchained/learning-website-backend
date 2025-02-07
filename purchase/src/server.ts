import mongo from "mongoose";
import configs from "./config_env";
import app from "./app";

async function start() {
  try {
    await mongo
      .connect(configs.mongoUri)
      .then(() => console.log(`mongodb connected on ${mongo.connection.host}`));

    app.listen(4005, () => console.log("purchase service listen to port 4005"));

    await fetch("http://localhost:5000/register/purchase/1.1.1/4005", {
      method: "POST",
    });
  } catch (error) {
    console.log(error);
    unregister();
  }
}

start();

async function unregister() {
  await fetch("http://localhost:5000/register/purchase/1.1.1/4005", {
    method: "DELETE",
  });
}
