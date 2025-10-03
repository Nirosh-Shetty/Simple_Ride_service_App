import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.REDIS_URL);
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export default redis;
