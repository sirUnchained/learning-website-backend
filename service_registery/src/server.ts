import app from "./app";

function start() {
  try {
    app.listen({ port: 5000 });
    console.log("server registery listen to port 5000.");
  } catch (error) {
    process.exit(1);
  }
}
start();
