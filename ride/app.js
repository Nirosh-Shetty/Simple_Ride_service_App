import express from "express";
import router from "./routes/ride.routes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(express.json());

app.listen(3003, () => {
  console.log("Ride service is running on port 3003");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Ride service connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
