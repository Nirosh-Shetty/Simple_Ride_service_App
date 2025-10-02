import express from "express";
const app = express();
import proxy from "express-http-proxy";

app.use("/user", proxy("http://localhost:3001"));
app.use("/captain", proxy("http://localhost:3002"));
app.use("/ride", proxy("http://localhost:3003"));

app.listen(3000, () => {
  console.log("Gateway service running at port 3000");
});
