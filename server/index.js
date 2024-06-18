import express from "express";
import workerRoute from './routes/workers.route.js';
import locationRoute from './routes/location.route.js';

const app = express();
const port = 3000;

async function main() {
  app.use(express.json())

  app.get("/", (req, res) => {
    res.send("Hello!");
  });

  app.use("/worker", workerRoute);
  app.use("/location", locationRoute);

  app.listen(port, "0.0.0.0", () => {
    console.info(`App listening on ${port}.`);
  });
}

await main();
