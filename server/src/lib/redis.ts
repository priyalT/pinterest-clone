import "dotenv/config";
import { createClient } from "redis";

const redisClient = createClient({url: process.env.REDIS_URL})
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().then(() => {
    console.log("Connected to Redis");
});
export default redisClient;