import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
    console.warn("Upstash Redis credentials are not set. Caching will fail unless testing offline with mock.");
}

let redisClient: any = null;
if (redisUrl && redisToken && (redisUrl.startsWith("http://") || redisUrl.startsWith("https://"))) {
    redisClient = new Redis({
        url: redisUrl,
        token: redisToken,
    });
} else {
    // Graceful no-op mock so calls like redis.get / setex don't throw TypeError: Failed to parse URL from /pipeline
    redisClient = {
        get: async () => null,
        set: async () => "OK",
        setex: async () => "OK",
        del: async () => 1,
    };
}

export const redis = redisClient;
