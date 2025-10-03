import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./routes/captain.routes.js";
import mongoose from "mongoose";
import { connect as connectRabbitMq } from "./service/rabbit.js";
connectRabbitMq();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(express.json());

app.listen(3002, () => {
  console.log("Captain service is running on port 3002");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Captain service connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
