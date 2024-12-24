import app from "./app";

function start() {
  try {
    app.listen({ port: 4000 });
    console.log("api getway listen to port 4000");
  } catch (error) {
    throw error;
  }
}
start();
