import Redis from "ioredis";
import dotenv from "dotenv"
dotenv.config()

export const redis = new Redis(process.env.REDIS_UPSTASH_URL || "")


await redis.set('foo', 'bar');
const result = await redis.get('foo');
console.log(result)  // >>> bar