import redisClient from '../lib/redis.js';

export const clearCache = async (pattern: string) => {
    try {
        const keys = await redisClient.keys(pattern);
        
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`Cleared ${keys.length} cache entries for pattern: ${pattern}`);
        }
    } catch (error) {
        console.error("Cache invalidation error:", error);
    }
};
