import "dotenv/config";
import { createClient } from "redis";

const client = createClient({url: process.env.REDIS_URL})