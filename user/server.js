import express from "express";
import router from "./routes/user.routes";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();

app.use(router);
app.use(express.json());

app.listen(3001, () => {
  console.log("User service is running on port 3001");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("User service connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
