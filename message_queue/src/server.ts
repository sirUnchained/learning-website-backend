import app from "./app";
import Redis from "ioredis";

// const redis = new Redis({
//   host: "localhost",
//   port: 6379,
// });

async function start() {
  app.listen(4000, () => {
    console.log("message queue listen on port", 4000);
  });
}
start();
